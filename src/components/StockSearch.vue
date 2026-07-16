<template>
  <div class="stock-search">
    <div class="search-box" :class="{ focused }">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input
        v-model="store.keyword"
        placeholder="搜索股票名称或代码"
        @input="store.onInput($event.target.value)"
        @focus="focused = true"
        @blur="focused = false"
        @keydown.enter="onEnter"
        @keydown.esc="store.searchResults = []"
      />
      <button v-if="store.keyword" class="clear-btn" @click="store.reset()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <Transition name="dropdown">
      <ul v-if="store.searchResults.length" class="suggestions">
        <li v-for="s in store.searchResults" :key="s.code" @mousedown.prevent="store.selectStock(s)">
          <span class="name">{{ s.name }}</span>
          <span class="code">{{ s.code }}</span>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStockStore } from '../stores/stock'

const store = useStockStore()
const focused = ref(false)

function onEnter() {
  if (store.searchResults.length === 1) {
    store.selectStock(store.searchResults[0])
  }
}
</script>

<style scoped>
.stock-search { position: relative; }
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--cs-hover);
  border-radius: var(--cs-radius-md);
  padding: 14px 18px;
  transition: background 0.3s var(--cs-ease), box-shadow 0.3s var(--cs-ease);
}
.search-box.focused {
  background: var(--cs-sidebar);
  box-shadow: var(--cs-focus-ring);
}
.icon { width: 20px; height: 20px; color: var(--cs-ink-faint); flex-shrink: 0; }
input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 17px;
  color: var(--cs-ink);
  letter-spacing: -0.022em;
}
input::placeholder { color: var(--cs-ink-faint); }
.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--cs-ink-faint);
  padding: 4px;
  border-radius: 50%;
  transition: color 0.2s, background 0.2s;
}
.clear-btn:hover { color: var(--cs-ink); background: var(--cs-border); }
.suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--cs-sidebar);
  border-radius: var(--cs-radius-lg);
  list-style: none;
  box-shadow: var(--cs-shadow-hover);
  z-index: 10;
  overflow: hidden;
  padding: 6px;
}
.suggestions li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-radius: var(--cs-radius-sm);
  cursor: default;
  transition: background 0.15s;
}
.suggestions li:hover { background: var(--cs-hover); }
.name { font-weight: 500; font-size: 15px; }
.code { font-size: 13px; color: var(--cs-ink-faint); font-family: "SF Mono", SFMono-Regular, Menlo, monospace; }
.dropdown-enter-active,
.dropdown-leave-active { transition: opacity 0.2s var(--cs-ease), transform 0.2s var(--cs-ease); }
.dropdown-enter-from,
.dropdown-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
