<template>
  <div class="min-h-screen bg-gray-50">
    <SiteNotificationManager /> 
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: '%s | SUITOPS HIRE',
})
</script>