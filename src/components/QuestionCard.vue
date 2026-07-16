<template>
  <a v-if="question.sourceUrl" :href="question.sourceUrl" target="_blank" class="question-card">
    <div class="question-text">{{ question.question }}</div>
    <div v-if="question.questionEn" class="question-en">{{ question.questionEn }}</div>
  </a>
  <div v-else class="question-card">
    <div class="question-text">{{ question.question }}</div>
    <div v-if="question.questionEn" class="question-en">{{ question.questionEn }}</div>
  </div>
</template>

<script setup>
defineProps({ question: { type: Object, required: true } })
</script>

<style scoped>
.question-card {
  display: block;
  background: var(--cs-sidebar);
  border-radius: var(--cs-radius-md);
  padding: 14px 18px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s var(--cs-ease-elastic), box-shadow 0.3s var(--cs-ease), background 0.2s;
}
a.question-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--cs-shadow);
  background: var(--cs-hover);
  text-decoration: none;
  color: inherit;
}
.question-text {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.003em;
  line-height: 1.25;
  color: var(--cs-ink);
}
.question-en {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  color: var(--cs-ink-soft);
  margin-top: 2px;
}
</style>
