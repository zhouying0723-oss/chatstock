<template>
  <details class="source-list" v-if="hasSources">
    <summary>查看原始公告与新闻</summary>
    <div class="sections">
      <section v-if="store.sources.announcements.length">
        <h4>📢 公告</h4>
        <a v-for="(a, i) in store.sources.announcements" :key="i" :href="a.url" target="_blank" class="source-item">
          <span class="title">{{ a.title }}</span>
          <span class="time">{{ a.displayTime }}</span>
        </a>
      </section>
      <section v-if="store.sources.news.length">
        <h4>📰 新闻</h4>
        <a v-for="(n, i) in store.sources.news" :key="i" :href="n.url" target="_blank" class="source-item">
          <span class="title">{{ n.title }}</span>
          <span class="meta">{{ n.mediaName }} · {{ n.displayTime }}</span>
        </a>
      </section>
    </div>
  </details>
</template>

<script setup>
import { computed } from 'vue'
import { useStockStore } from '../stores/stock'

const store = useStockStore()
const hasSources = computed(() =>
  store.sources.announcements.length || store.sources.news.length
)
</script>

<style scoped>
.source-list { margin-top: 20px; }
summary {
  cursor: pointer;
  color: var(--cs-ink-soft);
  font-size: 14px;
  padding: 8px 0;
  user-select: none;
}
summary:hover { color: var(--cs-accent); }
.sections { display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
h4 { font-size: 14px; margin-bottom: 6px; color: var(--cs-ink); }
.source-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 12px;
  border-radius: var(--cs-radius-sm);
  transition: background 0.15s;
  text-decoration: none;
}
.source-item:hover { background: var(--cs-hover); text-decoration: none; }
.title { font-size: 14px; color: var(--cs-ink); line-height: 1.5; }
.time, .meta { font-size: 12px; color: var(--cs-ink-faint); }
</style>
