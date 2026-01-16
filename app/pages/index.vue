<template>
  <div class="flex flex-col h-full">
    <!-- Month Navigation -->
    <div class="flex justify-between items-center mb-4">
      <UButton icon="i-heroicons-chevron-left" variant="ghost" @click="prevMonth" />
      <h2 class="text-lg font-bold">{{ year }}年 {{ month + 1 }}月</h2>
      <UButton icon="i-heroicons-chevron-right" variant="ghost" @click="nextMonth" />
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1 auto-rows-fr">
      <!-- Weekday Headers -->
      <div v-for="day in weekDays" :key="day" class="text-center text-gray-500 text-sm py-2 font-medium">
        {{ day }}
      </div>

      <!-- Days -->
      <!-- Empty cells for start padding -->
      <div v-for="n in startPadding" :key="'pad-' + n" class="bg-gray-50 dark:bg-gray-800/50 rounded-lg"></div>

      <!-- Actual Days -->
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="border dark:border-gray-700 min-h-[80px] p-1 relative bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg flex flex-col"
        @click="openDayDetails(day)"
      >
        <div class="text-right text-xs text-gray-500 mb-1">{{ day }}</div>
        <div class="flex flex-wrap gap-1 content-start flex-1">
          <template v-for="order in getOrdersForDay(day)" :key="order.id">
            <UAvatar v-if="order.brand.logo" :src="getLogoUrl(order.brand.logo)" size="2xs" />
            <div
              v-else
              class="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-[10px] text-primary-500 font-bold"
            >
              {{ order.brand.name[0] }}
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <UModal v-model:open="isModalOpen" :title="selectedDateStr + ' 订单详情'">
      <template #body>
        <div v-if="selectedDayOrders.length === 0" class="text-center py-8 text-gray-500">暂无订单</div>

        <div v-else class="space-y-4 max-h-[60vh] overflow-y-auto">
          <div
            v-for="order in selectedDayOrders"
            :key="order.id"
            class="flex items-center justify-between p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800/50 cursor-pointer select-none active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
            @mousedown="startPress(order)"
            @mouseup="cancelPress"
            @mouseleave="cancelPress"
            @touchstart="startPress(order)"
            @touchend="cancelPress"
            @contextmenu.prevent
          >
            <div class="flex items-center gap-3">
              <UAvatar :src="getLogoUrl(order.brand.logo)" :alt="order.brand.name" />
              <div>
                <div class="font-bold">{{ order.brand.name }} | {{ order.productName }}</div>
                <div class="text-xs text-gray-500">
                  {{ order.sugar }} | {{ order.temperature }}
                  <span v-if="order.toppings && order.toppings !== '无'"> | {{ order.toppings }}</span>
                  <span v-if="order.channel"> | {{ order.channel }}</span>
                  <span v-if="order.evaluation"> | <span class="text-xs text-gray-400 mt-1 italic">“{{ order.evaluation }}”</span></span>
                </div>
              </div>
            </div>
            <div class="font-bold text-primary-600">¥{{ order.price }}</div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-between items-center w-full">
          <div class="text-sm text-gray-500" v-if="selectedDayOrders.length > 0">
            共 {{ selectedDayOrders.length }} 杯，合计 ¥{{ selectedDayTotal }}
          </div>
          <div v-else>什么都没有</div>
        </div>
      </template>
    </UModal>

    <!-- Edit Modal -->
    <UModal v-model:open="isEditModalOpen" title="修改订单">
      <template #body>
        <OrderForm
          v-if="editingOrder"
          :initial-order="editingOrder"
          is-modal
          @success="onEditSuccess"
          @cancel="isEditModalOpen = false"
        />
      </template>
    </UModal>
  </div>
</template>

<script setup>
  import { getLogoUrl, formatLocalDate } from '@/assets/utils.js';
  const currentDate = ref(new Date());
  const year = computed(() => currentDate.value.getFullYear());
  const month = computed(() => currentDate.value.getMonth());

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const startPadding = computed(() => {
    const firstDay = new Date(year.value, month.value, 1).getDay();
    return firstDay;
  });

  const daysInMonth = computed(() => {
    return new Date(year.value, month.value + 1, 0).getDate();
  });

  const query = computed(() => {
    const start = new Date(year.value, month.value, 1);
    const end = new Date(year.value, month.value + 1, 0);
    return {
      startDate: formatLocalDate(start),
      endDate: formatLocalDate(end),
    };
  });

  // Fetch orders for current month
  const { data: orders, refresh } = await useFetch('/api/orders', {
    query,
  });

  function prevMonth() {
    currentDate.value = new Date(year.value, month.value - 1, 1);
  }

  function nextMonth() {
    currentDate.value = new Date(year.value, month.value + 1, 1);
  }

  function getOrdersForDay(day) {
    if (!orders.value) return [];
    return orders.value.filter(o => {
      const d = new Date(o.date);
      return d.getDate() === day;
    });
  }

  const isModalOpen = ref(false);
  const selectedDay = ref(1);
  const selectedDayOrders = computed(() => getOrdersForDay(selectedDay.value));
  const selectedDateStr = computed(() => `${year.value}年${month.value + 1}月${selectedDay.value}日`);
  const selectedDayTotal = computed(() => {
    return selectedDayOrders.value.reduce((sum, order) => sum + order.price, 0).toFixed(1);
  });

  function openDayDetails(day) {
    selectedDay.value = day;
    isModalOpen.value = true;
  }

  const isEditModalOpen = ref(false);
  const editingOrder = ref(null);
  let pressTimer = null;

  function startPress(order) {
    cancelPress();
    pressTimer = setTimeout(() => {
      editOrder(order);
    }, 600); // 600ms long press
  }

  function cancelPress() {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  }

  function editOrder(order) {
    editingOrder.value = order;
    isEditModalOpen.value = true;
  }

  async function onEditSuccess() {
    isEditModalOpen.value = false;
    await refresh();
  }
</script>
