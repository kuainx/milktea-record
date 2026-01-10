<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-lg font-semibold mb-4">记一杯奶茶</h2>
    <OrderForm @success="onSuccess" />
  </div>
</template>

<script setup>
  const router = useRouter();
  function onSuccess() {
    router.push('/');
  }
</script>
