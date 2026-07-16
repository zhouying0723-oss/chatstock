const { getSettings } = require('./db')

async function chatRaw(messages, { endpoint, apiKey, model } = {}) {
  const settings = getSettings()
  const ep = endpoint || settings?.ai_endpoint
  const key = apiKey || settings?.ai_api_key
  const md = model || settings?.ai_model

  if (!ep || !key || !md) throw new Error('请先在设置页配置 AI 接口')

  const resp = await fetch(ep, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model: md, messages, temperature: 0.3 }),
  })

  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    throw new Error(`AI 接口错误 ${resp.status}: ${text.slice(0, 200)}`)
  }

  const data = await resp.json()
  return data.choices?.[0]?.message?.content || ''
}

async function chatJson(messages, opts = {}) {
  const raw = await chatRaw(messages, opts)
  const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || raw.match(/(\{[\s\S]*\})/)
  const jsonStr = m ? m[1] : raw
  return JSON.parse(jsonStr)
}

module.exports = { chatRaw, chatJson }
