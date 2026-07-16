import { defineStore } from 'pinia'
import { ref } from 'vue'
import { stockApi, questionsApi } from '../services/api'

export const useStockStore = defineStore('stock', () => {
  const keyword = ref('')
  const searchResults = ref([])
  const selectedStock = ref(null)
  const questions = ref([])
  const deepQuestions = ref([])
  const deepLoading = ref(false)
  const sources = ref({ announcements: [], news: [] })
  const loading = ref(false)
  const error = ref('')
  const recentQuestions = ref([])
  let lastQuickId = 0
  let deepPollTimer = null

  function onInput(val) {
    keyword.value = val
    clearTimeout(deepPollTimer)
    if (!val.trim()) {
      searchResults.value = []
      return
    }
    searchResults.value = []
    setTimeout(async () => {
      try {
        searchResults.value = await stockApi.search(val.trim())
      } catch {
        searchResults.value = []
      }
    }, 300)
  }

  async function selectStock(stock) {
    selectedStock.value = stock
    keyword.value = stock.name
    searchResults.value = []
    questions.value = []
    deepQuestions.value = []
    deepLoading.value = false
    sources.value = { announcements: [], news: [] }
    error.value = ''
    loading.value = true
    clearTimeout(deepPollTimer)

    try {
      stockApi.recordQuery(stock.name, stock.code, stock.name)
      const result = await questionsApi.generate(stock.code, stock.name)
      questions.value = result.questions || []
      lastQuickId = result.lastQuickId || 0
      sources.value = result.sources || { announcements: [], news: [] }
      if (result.warning) error.value = result.warning

      // Start polling for deep analysis
      deepLoading.value = true
      pollDeep(stock.code)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function pollDeep(stockCode) {
    clearTimeout(deepPollTimer)
    deepPollTimer = setTimeout(async () => {
      try {
        const items = await questionsApi.deep(stockCode, lastQuickId)
        if (items.length > 0) {
          deepQuestions.value = items
          deepLoading.value = false
        } else {
          // Not ready yet, keep polling
          pollDeep(stockCode)
        }
      } catch {
        pollDeep(stockCode)
      }
    }, 3000)
  }

  async function feedback(questionId, useful) {
    try {
      await questionsApi.feedback(questionId, useful)
      const q = questions.value.find(q => q.id === questionId)
      if (q) q.useful = useful ? 1 : 0
      const dq = deepQuestions.value.find(q => q.id === questionId)
      if (dq) dq.useful = useful ? 1 : 0
    } catch {}
  }

  function reset() {
    keyword.value = ''
    searchResults.value = []
    selectedStock.value = null
    questions.value = []
    deepQuestions.value = []
    deepLoading.value = false
    sources.value = { announcements: [], news: [] }
    loading.value = false
    error.value = ''
    clearTimeout(deepPollTimer)
  }

  return {
    keyword, searchResults, selectedStock, questions, deepQuestions, deepLoading,
    sources, loading, error, recentQuestions,
    onInput, selectStock, feedback, reset,
  }
})
