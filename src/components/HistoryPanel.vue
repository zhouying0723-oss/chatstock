<template>
  <div class="history-panel">
    <h3 class="panel-title">历史查询</h3>
    <div v-if="items.length" class="history-list">
      <button v-for="item in items" :key="item.id" class="history-item" @click="onSelect(item)">
        <div class="item-main">
          <span class="item-name">{{ item.stock_name }}</span>
          <span class="item-code">{{ item.stock_code }}</span>
        </div>
        <span class="item-time">{{ formatTime(item.created_at) }}</span>
      </button>
    </div>
    <div v-else class="empty">暂无查询记录</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStockStore } from '../stores/stock'
import { stockApi } from '../services/api'

const store = useStockStore()
const items = ref([])

onMounted(() => loadHistory())

async function loadHistory() {
  try {
    items.value = await stockApi.history()
  } catch {}
}

function onSelect(item) {
  store.selectStock({ code: item.stock_code, name: item.stock_name })
}

function formatTime(ts) {
  const d = new Date(ts * 1000)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  return `${d.getMonth() + 1}/${d.getDate()}`
}

// Expose for parent to refresh
defineExpose({ loadHistory })
</script>

<style scoped>
.history-panel {
  background: var(--cs-sidebar);
  border-radius: var(--cs-radius-lg);
  padding: 24px;
}
.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--cs-ink-soft);
  letter-spacing: .011em;
  text-transform: uppercase;
  margin-bottom: 16px;
}
.history-list { display: flex; flex-direction: column; gap: 2px; }
.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: var(--cs-radius-sm);
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
}
.history-item:hover { background: var(--cs-hover); }
.item-main { display: flex; align-items: baseline; gap: 8px; min-width: 0; }
.item-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--cs-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-code {
  font-size: 12px;
  color: var(--cs-ink-faint);
  font-family: "SF Mono", SFMono-Regular, Menlo, monospace;
  flex-shrink: 0;
}
.item-time {
  font-size: 12px;
  color: var(--cs-ink-faint);
  flex-shrink: 0;
  margin-left: 8px;
}
.empty {
  color: var(--cs-ink-faint);
  font-size: 14px;
  text-align: center;
  padding: 20px 0;
}
</style>
