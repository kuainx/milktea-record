<template>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-lg font-semibold">奶茶记录</h2>
    <div class="flex items-center gap-2">
      <span v-if="user" class="text-sm text-gray-600">{{ user.username }}</span>
      <UButton v-if="user" icon="i-heroicons-arrow-right-on-rectangle" size="sm" color="neutral" variant="ghost" @click="logout">
        退出
      </UButton>
    </div>
  </div>
</template>

<script setup>
  const user = useCookie('user')
  const toast = useToast()

  async function logout() {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      // Clear user cookie
      user.value = null
      
      // Refresh page
      window.location.reload()
    } catch (e) {
      toast.add({ title: '错误', description: '退出失败', color: 'red' })
    }
  }
</script>