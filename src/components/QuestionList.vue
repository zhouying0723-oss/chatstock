<template>
  <div class="question-list">
    <div v-if="store.loading" class="loading">
      <span class="spinner"></span>
      <span>正在分析公告与新闻，生成关键问题…</span>
    </div>
    <div v-else-if="store.error" class="error">{{ store.error }}</div>
    <div v-else-if="store.questions.length">
      <h3 class="section-title">{{ store.selectedStock?.name }} — 关键问题</h3>
      <QuestionCard v-for="q in store.questions" :key="q.id || q.question" :question="q" />
    </div>
  </div>
</template>

<script setup>
import { useStockStore } from '../stores/stock'
import QuestionCard from './QuestionCard.vue'

const store = useStockStore()
</script>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  padding: 40px 0;
  color: var(--cs-ink-soft);
}
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--cs-border);
  border-top-color: var(--cs-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.error {
  text-align: center;
  padding: 24px;
  color: var(--cs-danger);
  background: rgba(var(--cs-danger-rgb), 0.06);
  border-radius: var(--cs-radius-md);
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--cs-ink);
}
.question-list { display: flex; flex-direction: column; gap: 12px; }
</style>
