<template>
  <div class="question-card" :class="{ useful: question.useful === 1, notUseful: question.useful === 0 }">
    <div class="question-text">{{ question.question }}</div>
    <div v-if="question.questionEn" class="question-en">{{ question.questionEn }}</div>
    <div class="meta">
      <a v-if="question.sourceUrl" :href="question.sourceUrl" target="_blank" class="source-pill">
        {{ sourceIcon }} {{ question.sourceTitle?.slice(0, 30) }}
      </a>
      <span v-else class="source-pill plain">{{ sourceIcon }} {{ sourceLabel }}</span>
    </div>
    <div class="actions">
      <button class="pill-btn" :class="{ active: question.useful === 1 }" @click="feedback(true)">有用</button>
      <button class="pill-btn" :class="{ active: question.useful === 0 }" @click="feedback(false)">无用</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStockStore } from '../stores/stock'

const props = defineProps({ question: { type: Object, required: true } })
const store = useStockStore()

const sourceIcon = computed(() =>
  props.question.sourceType === 'announcement' ? '📢' : '📰'
)
const sourceLabel = computed(() =>
  props.question.sourceType === 'announcement' ? '公告' : '新闻'
)

function feedback(useful) {
  if (props.question.id) store.feedback(props.question.id, useful)
}
</script>

<style scoped>
.question-card {
  background: var(--cs-sidebar);
  border-radius: var(--cs-radius-lg);
  padding: 24px;
  transition: transform 0.3s var(--cs-ease-elastic), box-shadow 0.3s var(--cs-ease);
}
.question-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--cs-shadow-hover);
}
.question-card.useful { border-left: 3px solid #30d158; }
.question-card.notUseful { border-left: 3px solid var(--cs-danger); }

.question-text {
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.003em;
  line-height: 1.2;
  color: var(--cs-ink);
}
.question-en {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--cs-ink-soft);
  margin-top: 4px;
}
.meta { margin-top: 14px; }
.source-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: var(--cs-pill-radius);
  background: var(--cs-hover);
  color: var(--cs-accent);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: background 0.2s;
}
.source-pill:hover { background: var(--cs-border); }
.source-pill.plain { color: var(--cs-ink-soft); }
.source-pill.plain:hover { background: var(--cs-hover); }

.actions { margin-top: 16px; display: flex; gap: 8px; }
.pill-btn {
  padding: 6px 16px;
  border-radius: var(--cs-pill-radius);
  border: none;
  background: var(--cs-bg);
  color: var(--cs-ink-soft);
  font-size: 13px;
  font-weight: 400;
  transition: all 0.2s var(--cs-ease);
}
.pill-btn:hover { color: var(--cs-ink); background: var(--cs-border); }
.pill-btn.active { color: var(--cs-bg); background: var(--cs-ink); }
</style>
