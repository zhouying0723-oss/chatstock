const { Router } = require('express')
const { chatJson } = require('../llm')
const { insertQuestions, updateQuestionFeedback, getRecentQuestions, getDeepQuestions } = require('../db')
const { getAnnouncements, getNews } = require('../eastmoney')

const router = Router()

function buildQuickPrompt(stockName, announcements, news) {
  const parts = [`你是一位专业的A股分析师。从以下关于"${stockName}"的最新公告和新闻标题中，快速生成3个专业问题。

严格要求：
1. 中文标题不超过30字，同时提供英文标题（15词以内）
2. 3个问题必须完全不同，分别关注不同维度
3. 从所有来源中挑选最新、最实质性的信息，不要选日常流水账
4. 问题要专业且有深度，指向关键判断或潜在影响，不要标题党
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
      parts.push(`N${i + 1}. ${n.title} (${n.displayTime} ${n.mediaName})`)
    })
  }

  parts.push('\n请严格返回如下JSON格式，不要包含其他文字：\n{"questions":[{"question":"中文标题","questionEn":"English title","sourceType":"announcement或news","sourceIndex":0}]}')
  parts.push('其中 sourceIndex 是从0开始的序号，对应公告或新闻的顺序。')

  return parts.join('\n')
}

function buildDeepPrompt(stockName, announcements, news) {
  const parts = [`你是一位专业的A股分析师。以下是关于"${stockName}"的最新公告和新闻全文内容，请仔细阅读后生成3个专业问题。

严格要求：
1. 中文标题不超过30字，同时提供英文标题（15词以内）
2. 3个问题必须完全不同，分别关注不同维度
3. 基于正文内容深入分析，挖掘标题之外的隐含信息和深层影响
4. 如果正文中有具体数字（金额、比例、日期、数量等），尽量在问题中引用，让问题更具体有说服力
5. 问题要专业且有深度，指向关键判断或潜在影响，不要标题党
6. 每个问题标注来源序号（公告从A1开始编号，新闻从N1开始编号）`]

  if (announcements.length) {
    parts.push('\n【公告】')
    announcements.forEach((a, i) => {
      parts.push(`A${i + 1}. ${a.title} (${a.displayTime})`)
      if (a.content) parts.push(`正文：${a.content}`)
    })
  }

  if (news.length) {
    parts.push('\n【新闻】')
    news.forEach((n, i) => {
      parts.push(`N${i + 1}. ${n.title} (${n.displayTime} ${n.mediaName})`)
      if (n.content) parts.push(`正文：${n.content}`)
    })
  }

  parts.push('\n请严格返回如下JSON格式，不要包含其他文字：\n{"questions":[{"question":"中文标题","questionEn":"English title","sourceType":"announcement或news","sourceIndex":0}]}')
  parts.push('其中 sourceIndex 是从0开始的序号，对应公告或新闻的顺序。')

  return parts.join('\n')
}

const QUICK_SYSTEM = '你是一位专业的A股分析师，只输出JSON。仅基于公告新闻标题快速生成专业问题，中文30字内+英文15词内，不标题党，3个问题关注不同维度。'
const DEEP_SYSTEM = '你是一位专业的A股分析师，只输出JSON。基于公告新闻全文内容深入分析生成专业问题，中文30字内+英文15词内，挖掘隐含信息，引用正文中的具体数字，不标题党，3个问题关注不同维度。'

function mapQuestions(result, stockCode, stockName, announcements, news, analysisType) {
  return (result.questions || []).map(q => {
    const sources = q.sourceType === 'announcement' ? announcements : news
    const src = sources[q.sourceIndex] || sources[0]
    return {
      stockCode,
      stockName,
      question: q.question,
      questionEn: q.questionEn || '',
      sourceType: q.sourceType || (announcements.length ? 'announcement' : 'news'),
      sourceTitle: src?.title || '',
      sourceUrl: src?.url || '',
      analysisType,
    }
  })
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

    // Quick pass: title-only
    const quickPrompt = buildQuickPrompt(stockName, announcements, news)
    const quickResult = await chatJson([
      { role: 'system', content: QUICK_SYSTEM },
      { role: 'user', content: quickPrompt },
    ])
    const quickQuestions = mapQuestions(quickResult, stockCode, stockName, announcements, news, 'quick')
    const savedQuick = insertQuestions(quickQuestions)

    // Return quick results immediately, include lastQuickId for polling
    const lastQuickId = savedQuick.length ? savedQuick[savedQuick.length - 1].id : 0
    res.json({ questions: savedQuick, lastQuickId, sources: { announcements, news } })

    // Deep pass: full content, async (client polls for results)
    const deepPrompt = buildDeepPrompt(stockName, announcements, news)
    chatJson([
      { role: 'system', content: DEEP_SYSTEM },
      { role: 'user', content: deepPrompt },
    ]).then(deepResult => {
      const deepQuestions = mapQuestions(deepResult, stockCode, stockName, announcements, news, 'deep')
      insertQuestions(deepQuestions)
    }).catch(e => {
      console.warn('[questions] deep analysis error:', e.message)
    })
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

router.get('/deep', (req, res) => {
  const code = String(req.query.stockCode || '').trim()
  const afterId = Number(req.query.afterId) || 0
  if (!code) return res.json([])
  res.json(getDeepQuestions(code, afterId))
})

router.get('/recent', (req, res) => {
  const code = String(req.query.stockCode || '').trim()
  if (!code) return res.json([])
  res.json(getRecentQuestions(code))
})

module.exports = router
