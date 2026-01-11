<template>
  <UForm :state="form" @submit="submitOrder" class="space-y-4">
    <UFormField label="日期" name="date" required>
      <UInput type="date" v-model="form.date" class="w-full" />
    </UFormField>

    <UFormField label="品牌" name="brandId" required>
      <USelectMenu
        v-model="selectedBrand"
        :items="brandsList"
        placeholder="选择品牌"
        :search-input="{
          placeholder: '搜索品牌',
          icon: 'i-heroicons-magnifying-glass',
        }"
        :avatar="selectedBrand?.avatar"
        class="w-full"
      >
      </USelectMenu>
    </UFormField>

    <UFormField label="产品名称" name="productName" required>
      <UInput v-model="form.productName" placeholder="例如：多肉葡萄" class="w-full" />
    </UFormField>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="价格" name="price" required>
        <UInput type="number" v-model="form.price" step="0.1" placeholder="0.0" class="w-full" />
      </UFormField>
      <UFormField label="渠道" name="channel">
        <USelect v-model="form.channel" :items="channelOptions" class="w-full" />
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UFormField label="糖度" name="sugar">
        <USelect v-model="form.sugar" :items="sugarOptions" class="w-full" />
      </UFormField>
      <UFormField label="温度" name="temperature">
        <USelect v-model="form.temperature" :items="temperatureOptions" class="w-full" />
      </UFormField>
    </div>

    <UFormField label="小料" name="toppings">
      <UInput v-model="form.toppings" placeholder="例如：加珍珠、少珍珠" class="w-full" />
    </UFormField>

    <div class="flex gap-2 mt-6">
      <UButton v-if="isModal" color="neutral" variant="subtle" @click="$emit('cancel')">取消</UButton>
      <UButton type="submit" block :loading="saving" size="lg" class="flex-1">
        {{ initialOrder ? '更新' : '提交' }}
      </UButton>
    </div>
  </UForm>
</template>

<script setup>
  import { getBrandData, formatLocalDate } from '@/assets/utils.js';

  const props = defineProps({
    initialOrder: {
      type: Object,
      default: null,
    },
    isModal: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['success', 'cancel']);

  const brandsList = await getBrandData();
  onMounted(async () => {
    brandsList.value = await getBrandData();
    if (props.initialOrder) {
      selectedBrand.value = brandsList.value.find((b) => b.value === props.initialOrder.brandId);
    }
  });

  const toast = useToast();

  const sugarOptions = ['标准糖', '半糖', '少糖', '微糖', '无糖'];
  const temperatureOptions = ['热', '常温', '少冰', '正常冰', '冰沙'];
  const channelOptions = ['饿了么', '美团', '小程序', '线下', '京东', '其他'];

  const form = reactive({
    date: props.initialOrder ? formatLocalDate(props.initialOrder.date) : formatLocalDate(),
    productName: props.initialOrder?.productName || '',
    price: props.initialOrder?.price || '',
    sugar: props.initialOrder?.sugar || '无糖',
    temperature: props.initialOrder?.temperature || '正常冰',
    toppings: props.initialOrder?.toppings || '',
    channel: props.initialOrder?.channel || '',
  });

  const selectedBrand = ref(null);
  const saving = ref(false);

  async function submitOrder() {
    if (!selectedBrand.value || !form.productName || !form.price) {
      toast.add({ title: 'Error', description: '请填写完整信息', color: 'red' });
      return;
    }

    saving.value = true;
    try {
      if (props.initialOrder) {
        await $fetch(`/api/orders/${props.initialOrder.id}`, {
          method: 'PUT',
          body: {
            ...form,
            brandId: selectedBrand.value.value,
          },
        });
        toast.add({ title: 'Success', description: '修改成功' });
      } else {
        await $fetch('/api/orders', {
          method: 'POST',
          body: {
            ...form,
            brandId: selectedBrand.value.value,
          },
        });
        toast.add({ title: 'Success', description: '记录成功' });
      }
      emit('success');
    } catch (e) {
      toast.add({ title: 'Error', description: e.message || '操作失败', color: 'red' });
    } finally {
      saving.value = false;
    }
  }
</script>
