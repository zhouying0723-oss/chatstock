<template>
  <div class="home-page">
    <header class="header">
      <h1 class="logo">ChatStock</h1>
      <router-link to="/settings" class="settings-link" title="AI 设置">⚙️</router-link>
    </header>

    <StockSearch />

    <div v-if="store.selectedStock" class="results">
      <QuestionList />
      <SourceList />
    </div>

    <div v-else class="empty">
      <p>输入股票名称或代码，获取 AI 生成的关键投资问题</p>
    </div>

    <SnackBar :message="snackMsg" :type="snackType" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStockStore } from '../stores/stock'
import StockSearch from './StockSearch.vue'
import QuestionList from './QuestionList.vue'
import SourceList from './SourceList.vue'
import SnackBar from './common/SnackBar.vue'

const store = useStockStore()
const snackMsg = ref('')
const snackType = ref('info')

watch(() => store.error, val => {
  if (val) {
    snackMsg.value = val
    snackType.value = 'error'
  }
})
</script>

<style scoped>
.home-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px;
  min-height: 100vh;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.logo {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--cs-accent), #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.settings-link {
  font-size: 20px;
  text-decoration: none;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--cs-radius-sm);
  transition: background 0.15s;
}
.settings-link:hover { background: var(--cs-hover); text-decoration: none; }
.results { margin-top: 24px; }
.empty {
  text-align: center;
  margin-top: 80px;
  color: var(--cs-ink-faint);
  font-size: 15px;
}
</style>
