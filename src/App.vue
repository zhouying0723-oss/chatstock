<template>
  <div class="app-root" :data-theme="theme">
    <nav class="nav">
      <div class="nav-inner">
        <router-link to="/" class="nav-logo">ChatStock</router-link>
        <router-link to="/settings" class="nav-link" title="AI 设置">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        </router-link>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
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
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--cs-nav-height);
  background: var(--cs-nav-bg);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  z-index: 9999;
}
.nav-inner {
  max-width: 980px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}
.nav-logo {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.003em;
  color: #f5f5f7;
  text-decoration: none;
}
.nav-logo:hover { color: #fff; }
.nav-link {
  color: rgba(245,245,247,0.8);
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: var(--cs-radius-sm);
  transition: color 0.3s var(--cs-ease);
}
.nav-link:hover { color: #2997ff; }
.main-content {
  padding-top: var(--cs-nav-height);
}
</style>
