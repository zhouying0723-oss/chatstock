<template>
  <div class="question-list">
    <div v-if="store.loading" class="loading">
      <div class="spinner"></div>
      <span>正在分析公告与新闻…</span>
    </div>
    <div v-else-if="store.error" class="error">{{ store.error }}</div>
    <div v-else-if="store.questions.length">
      <h3 class="section-title">{{ store.selectedStock?.name }}</h3>
      <div class="cards">
        <QuestionCard v-for="q in store.questions" :key="q.id || q.question" :question="q" />
      </div>
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
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 64px 0;
  color: var(--cs-ink-soft);
  font-size: 15px;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--cs-border);
  border-top-color: var(--cs-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.error {
  text-align: center;
  padding: 32px;
  color: var(--cs-danger);
  background: rgba(var(--cs-danger-rgb), 0.06);
  border-radius: var(--cs-radius-lg);
  font-size: 15px;
}
.section-title {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.003em;
  line-height: 1.1;
  margin-bottom: 20px;
}
.cards { display: flex; flex-direction: column; gap: 16px; }
</style>
