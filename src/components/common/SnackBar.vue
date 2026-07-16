<template>
  <div class="snackbar" :class="[type, { show: visible }]">
    {{ message }}
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'info' },
  duration: { type: Number, default: 3000 },
})

const visible = ref(false)
let timer = null

watch(() => props.message, val => {
  if (!val) return
  clearTimeout(timer)
  visible.value = true
  timer = setTimeout(() => { visible.value = false }, props.duration)
})
</script>

<style scoped>
.snackbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  padding: 10px 24px;
  border-radius: var(--cs-radius-md);
  font-size: 14px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 9999;
  pointer-events: none;
  max-width: 90vw;
  text-align: center;
}
.snackbar.show { opacity: 1; transform: translateX(-50%) translateY(0); }
.snackbar.info { background: var(--cs-ink); color: var(--cs-bg); }
.snackbar.error { background: var(--cs-danger); color: #fff; }
.snackbar.success { background: #16a34a; color: #fff; }
.snackbar.warning { background: var(--cs-warning-bg); color: var(--cs-warning-text); }
</style>
