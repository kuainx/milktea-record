<template>
  <UModal v-model:open="isOpen" title="用户登录" :dismissible="false" :close="false">
    <template #body>
      <UForm :state="form" @submit="handleLogin" class="space-y-4">
        <UFormField label="用户名" name="username" required>
          <UInput v-model="form.username" placeholder="请输入用户名" class="w-full" />
        </UFormField>

        <UFormField label="密码" name="password" required>
          <UInput v-model="form.password" type="password" placeholder="请输入密码" class="w-full" />
        </UFormField>

        <div class="flex gap-2 mt-6">
          <UButton color="neutral" variant="subtle" @click="showRegister = true">注册</UButton>
          <UButton type="submit" block :loading="loading" class="flex-1">登录</UButton>
        </div>
      </UForm>
    </template>
  </UModal>

  <UModal v-model:open="showRegister" title="用户注册">
    <template #body>
      <UForm :state="registerForm" @submit="handleRegister" class="space-y-4">
        <UFormField label="用户名" name="username" required>
          <UInput v-model="registerForm.username" placeholder="请输入用户名" class="w-full" />
        </UFormField>

        <UFormField label="密码" name="password" required>
          <UInput v-model="registerForm.password" type="password" placeholder="请输入密码" class="w-full" />
        </UFormField>

        <UFormField label="确认密码" name="confirmPassword" required>
          <UInput v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" class="w-full" />
        </UFormField>

        <div class="flex gap-2 mt-6">
          <UButton color="neutral" variant="subtle" @click="showRegister = false">返回</UButton>
          <UButton type="submit" block :loading="registerLoading" class="flex-1">注册</UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup>
  import { ref } from 'vue';
  import { md5 } from '@/assets/crypto.js';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:modelValue', 'login-success']);

  const isOpen = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  });

  onMounted(() => {
    const authToken = useCookie('auth_token');
    if (authToken.value) {
      isOpen.value = false;
    }
  });

  const showRegister = ref(false);
  const loading = ref(false);
  const registerLoading = ref(false);

  const form = reactive({
    username: '',
    password: '',
  });

  const registerForm = reactive({
    username: '',
    password: '',
    confirmPassword: '',
  });

  async function handleLogin() {
    if (!form.username || !form.password) {
      useToast().add({ title: '错误', description: '请填写完整信息', color: 'red' });
      return;
    }

    loading.value = true;
    try {
      const salt = 'milktea-record-salt';
      const hashedPassword = md5(form.password + salt);

      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          username: form.username,
          password: hashedPassword,
        },
      });

      useToast().add({ title: '成功', description: '登录成功' });
      emit('login-success');
      isOpen.value = false;

      // Reset form
      form.username = '';
      form.password = '';
    } catch (e) {
      useToast().add({ title: '错误', description: e.message || '登录失败', color: 'red' });
    } finally {
      loading.value = false;
    }
  }

  async function handleRegister() {
    if (!registerForm.username || !registerForm.password || !registerForm.confirmPassword) {
      useToast().add({ title: '错误', description: '请填写完整信息', color: 'red' });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      useToast().add({ title: '错误', description: '两次输入的密码不一致', color: 'red' });
      return;
    }

    registerLoading.value = true;
    try {
      const salt = 'milktea-record-salt';
      const hashedPassword = md5(registerForm.password + salt);

      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          username: registerForm.username,
          password: hashedPassword,
        },
      });

      useToast().add({ title: '成功', description: '注册成功，请登录' });
      showRegister.value = false;

      // Reset form
      registerForm.username = '';
      registerForm.password = '';
      registerForm.confirmPassword = '';
    } catch (e) {
      useToast().add({ title: '错误', description: e.message || '注册失败', color: 'red' });
    } finally {
      registerLoading.value = false;
    }
  }
</script>
