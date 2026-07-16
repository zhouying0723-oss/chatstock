<template>
  <details class="source-list" v-if="hasSources">
    <summary>查看原始公告与新闻</summary>
    <div class="sections">
      <section v-if="store.sources.announcements.length">
        <h4>📢 公告</h4>
        <a v-for="(a, i) in store.sources.announcements" :key="i" :href="a.url" target="_blank" class="source-item">
          <span class="title">{{ a.title }}</span>
          <span class="time">{{ a.displayTime?.split(' ')[0] }}</span>
        </a>
      </section>
      <section v-if="store.sources.news.length">
        <h4>📰 新闻</h4>
        <a v-for="(n, i) in store.sources.news" :key="i" :href="n.url" target="_blank" class="source-item">
          <span class="title">{{ n.title }}</span>
          <span class="meta">{{ n.mediaName }} · {{ n.displayTime?.split(' ')[0] }}</span>
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
.source-list { margin-top: 32px; }
summary {
  cursor: pointer;
  color: var(--cs-accent);
  font-size: 15px;
  padding: 8px 0;
  user-select: none;
  font-weight: 400;
  transition: color 0.2s;
}
summary:hover { color: var(--cs-accent-hover); }
.sections { display: flex; flex-direction: column; gap: 24px; margin-top: 12px; }
h4 { font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--cs-ink-soft); text-transform: uppercase; letter-spacing: .011em; }
.source-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 16px;
  border-radius: var(--cs-radius-md);
  transition: background 0.2s;
  text-decoration: none;
}
.source-item:hover { background: var(--cs-hover); text-decoration: none; }
.title { font-size: 15px; color: var(--cs-ink); line-height: 1.4; }
.time, .meta { font-size: 12px; color: var(--cs-ink-faint); }
</style>
