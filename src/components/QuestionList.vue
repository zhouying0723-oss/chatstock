<template>
  <div class="question-list">
    <div v-if="store.loading" class="loading">
      <div class="spinner"></div>
      <span>正在分析…</span>
    </div>
    <div v-else-if="store.error && !store.questions.length" class="error">{{ store.error }}</div>
    <template v-else-if="store.questions.length">
      <div class="section-header">
        <h3 class="section-title">速览</h3>
        <span class="section-tag">标题</span>
      </div>
      <div class="cards">
        <QuestionCard v-for="q in store.questions" :key="q.id" :question="q" />
      </div>

      <div class="section-header deep-header">
        <h3 class="section-title">深度</h3>
        <span class="section-tag">全文</span>
      </div>
      <div v-if="store.deepLoading" class="deep-loading">
        <div class="spinner small"></div>
        <span>阅读全文中…</span>
      </div>
      <div v-else-if="store.deepQuestions.length" class="cards">
        <QuestionCard v-for="q in store.deepQuestions" :key="q.id" :question="q" />
      </div>
    </template>
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
  gap: 12px;
  padding: 48px 0;
  color: var(--cs-ink-soft);
  font-size: 15px;
}
.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--cs-border);
  border-top-color: var(--cs-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.spinner.small { width: 16px; height: 16px; }
.error {
  text-align: center;
  padding: 24px;
  color: var(--cs-danger);
  background: rgba(var(--cs-danger-rgb), 0.06);
  border-radius: var(--cs-radius-md);
  font-size: 15px;
}
.section-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
  margin-top: 24px;
}
.section-header:first-child { margin-top: 0; }
.section-title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.003em;
  line-height: 1.1;
}
.section-tag {
  font-size: 11px;
  font-weight: 500;
  color: var(--cs-ink-faint);
  padding: 2px 8px;
  border-radius: var(--cs-pill-radius);
  background: var(--cs-hover);
  letter-spacing: .02em;
}
.deep-header {
  padding-top: 16px;
  border-top: 1px solid var(--cs-border);
}
.deep-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
  color: var(--cs-ink-soft);
  font-size: 13px;
}
.cards { display: flex; flex-direction: column; gap: 8px; }
</style>
