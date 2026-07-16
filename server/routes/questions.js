const { Router } = require('express')
const { chatJson } = require('../llm')
const { insertQuestions, updateQuestionFeedback, getRecentQuestions } = require('../db')
const { getAnnouncements, getNews } = require('../eastmoney')

const router = Router()

function buildPrompt(stockName, announcements, news) {
  const parts = [`你是一位专业的A股分析师助手。根据以下关于"${stockName}"的最新公告和新闻，生成3个投资者最需要关注的问题。

严格要求：
1. 每个问题不超过20个字
2. 3个问题必须完全不同，分别关注不同维度（如业绩、人事、资金等）
3. 问题要像新闻标题一样吸引人点击，有悬念或冲击力
4. 问题必须直接基于提供的公告或新闻内容生成，不要泛泛而谈
5. 每个问题标注来源序号（公告从A1开始编号，新闻从N1开始编号）`]

  if (announcements.length) {
    parts.push('\n【公告】')
    announcements.forEach((a, i) => {
      parts.push(`A${i + 1}. ${a.title} (${a.displayTime})`)
    })
  }

  if (news.length) {
    parts.push('\n【新闻】')
    news.forEach((n, i) => {
      parts.push(`N${i + 1}. ${n.title} — ${n.content} (${n.displayTime} ${n.mediaName})`)
    })
  }

  parts.push('\n请严格返回如下JSON格式，不要包含其他文字：\n{"questions":[{"question":"问题内容","sourceType":"announcement或news","sourceIndex":0}]}')
  parts.push('其中 sourceIndex 是从0开始的序号，对应公告或新闻的顺序。')

  return parts.join('\n')
}

router.post('/generate', async (req, res) => {
  const { stockCode, stockName } = req.body || {}
  if (!stockCode || !stockName) return res.status(400).json({ error: '缺少 stockCode 或 stockName' })

  try {
    const [announcements, news] = await Promise.all([
      getAnnouncements(stockCode, 5),
      getNews(stockName, 5),
    ])

    if (!announcements.length && !news.length) {
      return res.json({ questions: [], warning: '未获取到相关公告或新闻' })
    }

    const prompt = buildPrompt(stockName, announcements, news)
    const result = await chatJson([
      { role: 'system', content: '你是一位专业的A股分析师助手，只输出JSON。问题必须紧贴提供的公告新闻内容，不超过20字，像新闻标题一样吸引点击，3个问题关注完全不同维度。' },
      { role: 'user', content: prompt },
    ])

    const questions = (result.questions || []).map(q => {
      const sources = q.sourceType === 'announcement' ? announcements : news
      const src = sources[q.sourceIndex] || sources[0]
      return {
        stockCode,
        stockName,
        question: q.question,
        sourceType: q.sourceType || (announcements.length ? 'announcement' : 'news'),
        sourceTitle: src?.title || '',
        sourceUrl: src?.url || '',
      }
    })

    const saved = insertQuestions(questions)
    res.json({ questions: saved, sources: { announcements, news } })
  } catch (e) {
    console.warn('[questions] generate error:', e.message)
    res.status(500).json({ error: e.message })
  }
})

router.post('/:id/feedback', (req, res) => {
  const { useful } = req.body || {}
  if (typeof useful !== 'boolean') return res.status(400).json({ error: '缺少 useful 参数' })
  updateQuestionFeedback(Number(req.params.id), useful)
  res.json({ ok: true })
})

router.get('/recent', (req, res) => {
  const code = String(req.query.stockCode || '').trim()
  if (!code) return res.json([])
  res.json(getRecentQuestions(code))
})

module.exports = router
