<template>
  <div class="app-root" :data-theme="theme">
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const theme = computed(() => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
})
</script>

<style scoped>
.app-root { min-height: 100vh; }
</style>
