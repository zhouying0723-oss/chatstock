import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { stockApi, questionsApi } from '../services/api'

export const useStockStore = defineStore('stock', () => {
  const keyword = ref('')
  const searchResults = ref([])
  const selectedStock = ref(null)
  const questions = ref([])
  const sources = ref({ announcements: [], news: [] })
  const loading = ref(false)
  const error = ref('')
  const recentQuestions = ref([])

  let searchTimer = null

  function onInput(val) {
    keyword.value = val
    clearTimeout(searchTimer)
    if (!val.trim()) {
      searchResults.value = []
      return
    }
    searchTimer = setTimeout(async () => {
      try {
        searchResults.value = await stockApi.search(val.trim())
      } catch (e) {
        searchResults.value = []
      }
    }, 300)
  }

  async function selectStock(stock) {
    selectedStock.value = stock
    keyword.value = stock.name
    searchResults.value = []
    questions.value = []
    sources.value = { announcements: [], news: [] }
    error.value = ''
    loading.value = true

    try {
      stockApi.recordQuery(stock.name, stock.code, stock.name)
      const result = await questionsApi.generate(stock.code, stock.name)
      questions.value = result.questions || []
      sources.value = result.sources || { announcements: [], news: [] }
      if (result.warning) error.value = result.warning
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function feedback(questionId, useful) {
    try {
      await questionsApi.feedback(questionId, useful)
      const q = questions.value.find(q => q.id === questionId)
      if (q) q.useful = useful ? 1 : 0
    } catch {}
  }

  async function loadRecent(stockCode) {
    try {
      recentQuestions.value = await questionsApi.recent(stockCode)
    } catch {}
  }

  function reset() {
    keyword.value = ''
    searchResults.value = []
    selectedStock.value = null
    questions.value = []
    sources.value = { announcements: [], news: [] }
    loading.value = false
    error.value = ''
  }

  return { keyword, searchResults, selectedStock, questions, sources, loading, error, recentQuestions, onInput, selectStock, feedback, loadRecent, reset }
})
