<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">订单查询</h2>

    <div class="space-y-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div class="grid grid-cols-2 gap-2">
        <UFormField label="开始日期" name="startDate">
          <UInput type="date" v-model="filters.startDate" class="w-full" />
        </UFormField>
        <UFormField label="结束日期" name="endDate">
          <UInput type="date" v-model="filters.endDate" class="w-full" />
        </UFormField>
      </div>

      <UFormField label="品牌" name="brandId">
        <USelectMenu
          v-model="selectedBrand"
          :items="brandsList"
          placeholder="全部品牌"
          :search-input="{
            placeholder: '搜索品牌',
            icon: 'i-heroicons-magnifying-glass',
          }"
          class="w-full"
        >
          <template #label>
            <span v-if="selectedBrand">{{ selectedBrand.name }}</span>
            <span v-else class="text-gray-400">全部品牌</span>
          </template>
        </USelectMenu>
      </UFormField>

      <UFormField label="产品名称" name="productName">
        <UInput v-model="filters.productName" placeholder="搜索产品名称..." class="w-full" />
      </UFormField>

      <UButton block @click="search" :loading="pending">查询</UButton>
    </div>

    <div v-if="orders && orders.length > 0" class="space-y-2">
      <div
        v-for="order in orders"
        :key="order.id"
        class="flex items-center justify-between p-3 border dark:border-gray-700 rounded bg-white dark:bg-gray-800 shadow-sm"
      >
        <div class="flex items-center gap-3">
          <UAvatar :src="getLogoUrl(order.brand.logo)" :alt="order.brand.name" />
          <div>
            <div class="font-bold">{{ order.productName }}</div>
            <div class="text-xs text-gray-500">
              {{ formatDate(order.date) }} | {{ order.brand.name }} | {{ order.channel }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="font-bold text-primary-600">¥{{ order.price }}</div>
          <UButton
            icon="i-heroicons-pencil-square"
            size="xs"
            color="neutral"
            variant="subtle"
            @click="editOrder(order)"
          />
        </div>
      </div>
    </div>
    <div v-else-if="searched" class="text-center text-gray-500 py-8">未找到相关订单</div>

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
  import { getLogoUrl, getBrandData } from '@/assets/utils.js';
  const brandsList = await getBrandData();

  const filters = reactive({
    startDate: '',
    endDate: '',
    productName: '',
  });
  const selectedBrand = ref(null);
  const searched = ref(false);
  const isEditModalOpen = ref(false);
  const editingOrder = ref(null);

  const {
    data: orders,
    pending,
    refresh,
    execute,
  } = await useFetch('/api/orders', {
    immediate: false,
    watch: false,
    query: computed(() => {
      const query = {};
      if (filters.startDate) query.startDate = filters.startDate;
      if (filters.endDate) query.endDate = filters.endDate;
      if (selectedBrand.value) query.brandId = selectedBrand.value.value;
      if (filters.productName) query.productName = filters.productName;
      return query;
    }),
  });

  async function search() {
    searched.value = true;
    await execute();
  }

  function editOrder(order) {
    editingOrder.value = order;
    isEditModalOpen.value = true;
  }

  async function onEditSuccess() {
    isEditModalOpen.value = false;
    await refresh();
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }
</script>
