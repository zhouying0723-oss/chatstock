<template>
  <div class="question-list">
    <div v-if="store.loading" class="loading">
      <div class="spinner"></div>
      <span>正在分析公告与新闻…</span>
    </div>
    <div v-else-if="store.error && !store.questions.length" class="error">{{ store.error }}</div>
    <template v-else-if="store.questions.length">
      <section class="section">
        <h3 class="section-title">速览</h3>
        <p class="section-desc">基于标题快速分析</p>
        <div class="cards">
          <QuestionCard v-for="q in store.questions" :key="q.id" :question="q" />
        </div>
      </section>

      <section class="section deep-section">
        <h3 class="section-title">深度</h3>
        <p class="section-desc">阅读全文后深入分析</p>
        <div v-if="store.deepLoading" class="deep-loading">
          <div class="spinner small"></div>
          <span>正在深度阅读全文…</span>
        </div>
        <div v-else-if="store.deepQuestions.length" class="cards">
          <QuestionCard v-for="q in store.deepQuestions" :key="q.id" :question="q" />
        </div>
      </section>
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
.spinner.small { width: 20px; height: 20px; border-width: 2px; }
.error {
  text-align: center;
  padding: 32px;
  color: var(--cs-danger);
  background: rgba(var(--cs-danger-rgb), 0.06);
  border-radius: var(--cs-radius-lg);
  font-size: 15px;
}
.section { margin-bottom: 40px; }
.section-title {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.003em;
  line-height: 1.1;
  margin-bottom: 4px;
}
.section-desc {
  font-size: 14px;
  color: var(--cs-ink-faint);
  margin-bottom: 20px;
  letter-spacing: .011em;
}
.deep-section {
  padding-top: 32px;
  border-top: 1px solid var(--cs-border);
}
.deep-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 0;
  color: var(--cs-ink-soft);
  font-size: 14px;
}
.cards { display: flex; flex-direction: column; gap: 16px; }
</style>
