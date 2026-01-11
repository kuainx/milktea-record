<template>
  <div class="flex items-center gap-2">
    <UButton v-if="!user" color="primary" variant="ghost" @click="showLogin = true">
      登录
    </UButton>
    <div v-else class="flex items-center gap-2">
      <span class="text-sm text-gray-600">{{ user.username }}</span>
      <UButton icon="i-heroicons-arrow-right-on-rectangle" size="sm" variant="ghost" @click="logout">
        退出
      </UButton>
    </div>

    <AuthModal v-model="showLogin" @login-success="handleLoginSuccess" />
  </div>
</template>

<script setup>
const user = useCookie('auth_token')
const showLogin = ref(true)

async function logout() {
  user.value = null
  window.location.reload()
}

function handleLoginSuccess() {
  showLogin.value = false
  window.location.reload()
}
</script>