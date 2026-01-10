<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">品牌管理</h2>
      <UButton icon="i-heroicons-plus" @click="openModal()">添加品牌</UButton>
    </div>

    <div v-if="pending" class="flex justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin w-8 h-8" />
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <UCard v-for="brand in brands" :key="brand.id" class="relative">
        <template #header>
          <div class="flex justify-center h-20 items-center">
            <img v-if="brand.logo" :src="getLogoUrl(brand.logo)" :alt="brand.name" class="h-16 w-16 object-contain" />
            <div
              v-else
              class="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500"
            >
              No Logo
            </div>
          </div>
        </template>
        <div class="text-center font-bold truncate">{{ brand.name }}</div>
        <template #footer>
          <div class="flex justify-between">
            <UButton
              icon="i-heroicons-pencil-square"
              size="xs"
              color="gray"
              variant="ghost"
              @click="openModal(brand)"
            />
            <UButton icon="i-heroicons-trash" size="xs" color="red" variant="ghost" @click="confirmDelete(brand)" />
          </div>
        </template>
      </UCard>
    </div>

    <!-- Add/Edit Modal -->
    <UModal v-model:open="isModalOpen" :title="editingBrand ? '编辑品牌' : '添加品牌'">
      <template #body>
        <UForm :state="formState" @submit="saveBrand" class="space-y-4">
          <UFormField label="品牌名称" name="name" required>
            <UInput v-model="formState.name" placeholder="喜茶" class="w-full" />
          </UFormField>
          <UFormField label="Logo File" name="logo">
            <UInput v-model="formState.logo" placeholder="xicha.png" class="w-full" />
          </UFormField>
          <div class="flex justify-end gap-2 mt-4">
            <UButton color="gray" variant="ghost" @click="isModalOpen = false">取消</UButton>
            <UButton type="submit" :loading="saving">保存</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script setup>
  import { getLogoUrl } from '@/assets/utils.js';
  const { data: brands, refresh, pending } = await useFetch('/api/brands');
  const toast = useToast();

  const isModalOpen = ref(false);
  const editingBrand = ref(null);
  const saving = ref(false);
  const formState = reactive({
    name: '',
    logo: '',
  });

  function openModal(brand = null) {
    editingBrand.value = brand;
    if (brand) {
      formState.name = brand.name;
      formState.logo = brand.logo || '';
    } else {
      formState.name = '';
      formState.logo = '';
    }
    isModalOpen.value = true;
  }

  async function saveBrand() {
    if (!formState.name) return;
    saving.value = true;
    try {
      if (editingBrand.value) {
        await $fetch(`/api/brands/${editingBrand.value.id}`, {
          method: 'PUT',
          body: formState,
        });
      } else {
        await $fetch('/api/brands', {
          method: 'POST',
          body: formState,
        });
      }
      await refresh();
      isModalOpen.value = false;
      toast.add({ title: 'Success', description: '操作成功' });
    } catch (e) {
      toast.add({ title: 'Error', description: e.message || '操作失败', color: 'red' });
    } finally {
      saving.value = false;
    }
  }

  async function confirmDelete(brand) {
    if (!confirm(`确认删除 ${brand.name}?`)) return;
    try {
      await $fetch(`/api/brands/${brand.id}`, { method: 'DELETE' });
      await refresh();
      toast.add({ title: 'Deleted', description: '删除成功' });
    } catch (e) {
      toast.add({ title: 'Error', description: e.statusMessage || '删除失败', color: 'red' });
    }
  }
</script>
