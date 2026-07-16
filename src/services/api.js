const BASE = '/api'

async function request(url, opts = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `请求失败 ${res.status}`)
  return data
}

export const stockApi = {
  search: keyword => request(`/stock/search?keyword=${encodeURIComponent(keyword)}`),
  announcements: code => request(`/stock/announcements?code=${encodeURIComponent(code)}`),
  news: keyword => request(`/stock/news?keyword=${encodeURIComponent(keyword)}`),
  recordQuery: (keyword, stockCode, stockName) =>
    request('/stock/query', { method: 'POST', body: JSON.stringify({ keyword, stockCode, stockName }) }),
  history: () => request('/stock/history'),
}

export const questionsApi = {
  generate: (stockCode, stockName) =>
    request('/questions/generate', { method: 'POST', body: JSON.stringify({ stockCode, stockName }) }),
  feedback: (id, useful) =>
    request(`/questions/${id}/feedback`, { method: 'POST', body: JSON.stringify({ useful }) }),
  recent: stockCode => request(`/questions/recent?stockCode=${encodeURIComponent(stockCode)}`),
}

export const settingsApi = {
  get: () => request('/settings'),
  update: (ai_endpoint, ai_api_key, ai_model) =>
    request('/settings', { method: 'PUT', body: JSON.stringify({ ai_endpoint, ai_api_key, ai_model }) }),
  test: (ai_endpoint, ai_api_key, ai_model) =>
    request('/settings/test', { method: 'POST', body: JSON.stringify({ ai_endpoint, ai_api_key, ai_model }) }),
}
