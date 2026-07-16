const { Router } = require('express')
const { searchStocks, getAnnouncements, getNews } = require('../eastmoney')
const { insertQueryHistory, getRecentHistory } = require('../db')

const router = Router()

router.get('/search', async (req, res) => {
  const keyword = String(req.query.keyword || '').trim()
  if (!keyword) return res.json([])
  const results = await searchStocks(keyword)
  res.json(results)
})

router.get('/announcements', async (req, res) => {
  const code = String(req.query.code || '').trim()
  if (!code) return res.status(400).json({ error: '缺少 code 参数' })
  const list = await getAnnouncements(code)
  res.json(list)
})

router.get('/news', async (req, res) => {
  const keyword = String(req.query.keyword || '').trim()
  if (!keyword) return res.status(400).json({ error: '缺少 keyword 参数' })
  const list = await getNews(keyword)
  res.json(list)
})

router.post('/query', async (req, res) => {
  const { keyword, stockCode, stockName } = req.body || {}
  if (!keyword || !stockCode || !stockName) {
    return res.status(400).json({ error: '缺少参数' })
  }
  insertQueryHistory(keyword, stockCode, stockName)
  res.json({ ok: true })
})

router.get('/history', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 20)
  res.json(getRecentHistory(limit))
})

module.exports = router
