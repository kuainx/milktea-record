<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <header class="bg-white dark:bg-gray-800 shadow p-4 sticky top-0 z-50 flex justify-between items-center">
      <h1 class="text-xl font-bold text-primary-500">奶茶了么</h1>
      <AuthButton />
    </header>

    <main class="flex-1 container mx-auto p-4 mb-20">
      <slot />
    </main>

    <footer class="fixed bottom-0 w-full bg-white dark:bg-gray-800 border-t dark:border-gray-700 z-50 safe-area-bottom">
      <div class="flex justify-around items-center p-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
          :class="$route.path === item.to ? 'text-primary-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
        >
          <UIcon :name="item.icon" class="w-6 h-6" />
          <span class="text-xs">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup>
const navItems = [
  { label: '日历', icon: 'i-heroicons-calendar', to: '/' },
  { label: '记一杯', icon: 'i-heroicons-plus-circle', to: '/record' },
  { label: '查询', icon: 'i-heroicons-magnifying-glass', to: '/search' },
  { label: '品牌', icon: 'i-heroicons-tag', to: '/brands' }
]
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>