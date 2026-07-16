import { defineStore } from 'pinia'
import { ref } from 'vue'
import { settingsApi } from '../services/api'

export const useSettingsStore = defineStore('settings', () => {
  const aiEndpoint = ref('')
  const aiApiKey = ref('')
  const aiModel = ref('')
  const loaded = ref(false)

  async function load() {
    try {
      const s = await settingsApi.get()
      aiEndpoint.value = s.ai_endpoint || ''
      aiApiKey.value = s.ai_api_key || ''
      aiModel.value = s.ai_model || ''
      loaded.value = true
    } catch {}
  }

  async function save() {
    await settingsApi.update(aiEndpoint.value, aiApiKey.value, aiModel.value)
  }

  async function test() {
    return settingsApi.test(aiEndpoint.value, aiApiKey.value, aiModel.value)
  }

  return { aiEndpoint, aiApiKey, aiModel, loaded, load, save, test }
})
