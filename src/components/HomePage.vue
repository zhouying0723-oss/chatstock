<template>
  <div class="home-page">
    <div class="content-grid">
      <div class="main-col">
        <StockSearch />
        <div v-if="store.selectedStock" class="results">
          <QuestionList />
          <SourceList />
        </div>
        <div v-else class="empty">
          <h2 class="empty-title">输入股票名称或代码</h2>
          <p class="empty-sub">AI 分析最新公告与新闻，生成关键投资问题</p>
        </div>
      </div>
      <aside class="side-col">
        <HistoryPanel ref="historyPanel" />
      </aside>
    </div>
    <SnackBar :message="snackMsg" :type="snackType" />
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useStockStore } from '../stores/stock'
import StockSearch from './StockSearch.vue'
import QuestionList from './QuestionList.vue'
import SourceList from './SourceList.vue'
import HistoryPanel from './HistoryPanel.vue'
import SnackBar from './common/SnackBar.vue'

const store = useStockStore()
const snackMsg = ref('')
const snackType = ref('info')
const historyPanel = ref(null)

watch(() => store.selectedStock, () => {
  nextTick(() => historyPanel.value?.loadHistory())
})

watch(() => store.error, val => {
  if (val) {
    snackMsg.value = val
    snackType.value = 'error'
  }
})
</script>

<style scoped>
.home-page {
  max-width: 980px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}
.content-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 48px;
  align-items: start;
}
.main-col { min-width: 0; }
.side-col { position: sticky; top: calc(var(--cs-nav-height) + 24px); }
.results { margin-top: 40px; }
.empty {
  text-align: center;
  margin-top: 120px;
}
.empty-title {
  font-size: 40px;
  font-weight: 600;
  letter-spacing: -0.003em;
  line-height: 1.1;
  margin-bottom: 12px;
}
.empty-sub {
  font-size: 19px;
  color: var(--cs-ink-soft);
  font-weight: 400;
  letter-spacing: .011em;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .side-col { position: static; }
  .empty { margin-top: 64px; }
  .empty-title { font-size: 28px; }
  .empty-sub { font-size: 17px; }
}
</style>
