<template>
  <div>
    <AppHeader />

    <!-- Notification -->
    <NotificationManager />

    <main class="pt-20">
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>

    <AppFooter />
    <FeedbackButton />
  </div>
</template>

<script setup lang="ts">
import { NotificationManager, FeedbackButton } from '@/components/utils';
</script>
