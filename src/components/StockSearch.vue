<template>
  <div class="stock-search">
    <div class="search-box">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input
        v-model="store.keyword"
        placeholder="输入股票名称或代码"
        @input="store.onInput($event.target.value)"
        @keydown.enter="onEnter"
        @keydown.esc="store.searchResults = []"
      />
      <button v-if="store.keyword" class="clear-btn" @click="store.reset()">✕</button>
    </div>
    <ul v-if="store.searchResults.length" class="suggestions">
      <li v-for="s in store.searchResults" :key="s.code" @click="store.selectStock(s)">
        <span class="name">{{ s.name }}</span>
        <span class="code">{{ s.code }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useStockStore } from '../stores/stock'

const store = useStockStore()

function onEnter() {
  if (store.searchResults.length === 1) {
    store.selectStock(store.searchResults[0])
  }
}
</script>

<style scoped>
.stock-search { position: relative; max-width: 480px; margin: 0 auto; }
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--cs-bg);
  border: 1.5px solid var(--cs-border);
  border-radius: var(--cs-radius-lg);
  padding: 10px 16px;
  transition: border-color 0.2s;
}
.search-box:focus-within { border-color: var(--cs-accent); }
.icon { width: 18px; height: 18px; color: var(--cs-ink-faint); flex-shrink: 0; }
input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: var(--cs-ink);
}
input::placeholder { color: var(--cs-ink-faint); }
.clear-btn {
  background: none;
  border: none;
  color: var(--cs-ink-faint);
  cursor: pointer;
  font-size: 14px;
  padding: 2px 4px;
  border-radius: 4px;
}
.clear-btn:hover { color: var(--cs-ink); background: var(--cs-hover); }
.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--cs-bg);
  border: 1px solid var(--cs-border);
  border-radius: var(--cs-radius-md);
  margin-top: 4px;
  list-style: none;
  box-shadow: var(--cs-shadow);
  z-index: 10;
  overflow: hidden;
}
.suggestions li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.15s;
}
.suggestions li:hover { background: var(--cs-hover); }
.name { font-weight: 500; }
.code { font-size: 13px; color: var(--cs-ink-faint); font-family: monospace; }
</style>
