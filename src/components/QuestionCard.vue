<template>
  <div class="question-card" :class="{ useful: question.useful === 1, notUseful: question.useful === 0 }">
    <div class="question-text">{{ question.question }}</div>
    <div class="meta">
      <a v-if="question.sourceUrl" :href="question.sourceUrl" target="_blank" class="source-link">
        {{ sourceLabel }} {{ question.sourceTitle }}
      </a>
      <span v-else class="source-label">{{ sourceLabel }}</span>
    </div>
    <div class="actions">
      <button class="feedback-btn" :class="{ active: question.useful === 1 }" @click="feedback(true)" title="有用">👍</button>
      <button class="feedback-btn" :class="{ active: question.useful === 0 }" @click="feedback(false)" title="无用">👎</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStockStore } from '../stores/stock'

const props = defineProps({ question: { type: Object, required: true } })
const store = useStockStore()

const sourceLabel = computed(() =>
  props.question.sourceType === 'announcement' ? '📢 公告' : '📰 新闻'
)

function feedback(useful) {
  if (props.question.id) store.feedback(props.question.id, useful)
}
</script>

<style scoped>
.question-card {
  background: var(--cs-bg);
  border: 1px solid var(--cs-border);
  border-radius: var(--cs-radius-md);
  padding: 16px 20px;
  transition: border-color 0.2s;
}
.question-card:hover { border-color: rgba(var(--cs-accent-rgb), 0.3); }
.question-card.useful { border-left: 3px solid #16a34a; }
.question-card.notUseful { border-left: 3px solid var(--cs-danger); }

.question-text { font-size: 15px; line-height: 1.6; color: var(--cs-ink); }
.meta { margin-top: 8px; }
.source-link {
  font-size: 13px;
  color: var(--cs-accent);
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}
.source-label { font-size: 13px; color: var(--cs-ink-faint); }

.actions { margin-top: 10px; display: flex; gap: 8px; }
.feedback-btn {
  background: none;
  border: 1px solid var(--cs-border);
  border-radius: var(--cs-radius-sm);
  padding: 4px 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s;
}
.feedback-btn:hover { background: var(--cs-hover); }
.feedback-btn.active { background: var(--cs-selected); border-color: var(--cs-accent); }
</style>
