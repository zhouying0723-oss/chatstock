const { Router } = require('express')
const { getSettings, upsertSettings } = require('../db')
const { chatRaw } = require('../llm')

const router = Router()

router.get('/', (_req, res) => {
  const s = getSettings()
  if (!s) return res.json({ ai_endpoint: '', ai_api_key: '', ai_model: '' })
  res.json({ ai_endpoint: s.ai_endpoint, ai_api_key: s.ai_api_key, ai_model: s.ai_model })
})

router.put('/', (req, res) => {
  const { ai_endpoint, ai_api_key, ai_model } = req.body || {}
  if (!ai_endpoint || !ai_api_key || !ai_model) {
    return res.status(400).json({ error: '所有字段均为必填' })
  }
  upsertSettings(ai_endpoint, ai_api_key, ai_model)
  res.json({ ok: true })
})

router.post('/test', async (req, res) => {
  const { ai_endpoint, ai_api_key, ai_model } = req.body || {}
  if (!ai_endpoint || !ai_api_key || !ai_model) {
    return res.status(400).json({ error: '请先填写所有配置项' })
  }
  try {
    const reply = await chatRaw(
      [{ role: 'user', content: '你好，请回复"连接成功"' }],
      { endpoint: ai_endpoint, apiKey: ai_api_key, model: ai_model },
    )
    res.json({ ok: true, reply: reply.slice(0, 100) })
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message })
  }
})

module.exports = router
