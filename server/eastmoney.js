const SEARCH_URL = 'https://searchapi.eastmoney.com/api/suggest/get'
const ANNOUNCEMENT_URL = 'https://np-anotice-stock.eastmoney.com/api/security/ann'
const NEWS_URL = 'https://search-api-web.eastmoney.com/search/jsonp'

const SEARCH_TOKEN = 'D43BF722C8E33BDC906FB84D85E326E8'

async function fetchJson(url, timeoutMs = 10000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const resp = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    return await resp.json()
  } catch (e) {
    clearTimeout(timer)
    throw e
  }
}

async function searchStocks(keyword) {
  try {
    const url = `${SEARCH_URL}?input=${encodeURIComponent(keyword)}&type=14&token=${SEARCH_TOKEN}`
    const data = await fetchJson(url)
    const items = data?.QuotationCodeTable?.Data || []
    return items
      .filter(d => d.Classify === 'AStock')
      .map(d => ({
        code: d.Code,
        name: d.Name,
        pinyin: d.PinYin,
        quoteId: d.QuoteID,
      }))
  } catch (e) {
    console.warn('[eastmoney] search error:', e.message)
    return []
  }
}

async function getAnnouncements(code, pageSize = 5) {
  try {
    const url = `${ANNOUNCEMENT_URL}?sr=-1&page_size=${pageSize}&page_index=1&ann_type=A&stock_list=${encodeURIComponent(code)}`
    const data = await fetchJson(url)
    const list = data?.data?.list || []
    return list.map(item => ({
      title: item.title_ch || item.title || '',
      displayTime: item.display_time || '',
      artCode: item.art_code || '',
      columnName: item.columns?.[0]?.column_name || '',
      url: `https://data.eastmoney.com/notices/detail/${code}/${item.art_code}.html`,
    }))
  } catch (e) {
    console.warn('[eastmoney] announcements error:', e.message)
    return []
  }
}

async function getNews(keyword, pageSize = 5) {
  try {
    const cb = 'jQuery_cs'
    const param = JSON.stringify({
      uid: '',
      keyword,
      type: ['cmsArticleWebOld'],
      client: 'web',
      clientType: 'web',
      clientVersion: 'curr',
      param: {
        cmsArticleWebOld: {
          searchScope: 'default',
          sort: 'default',
          pageIndex: 1,
          pageSize,
          preTag: '',
          postTag: '',
        },
      },
    })
    const url = `${NEWS_URL}?cb=${cb}&param=${encodeURIComponent(param)}&_=${Date.now()}`
    const resp = await fetch(url, {
      headers: {
        'Referer': 'https://so.eastmoney.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    })
    const text = await resp.text()
    // Strip JSONP wrapper: jQuery_cs(...)
    const jsonStr = text.replace(/^[^(]+\(/, '').replace(/\);?$/, '')
    const data = JSON.parse(jsonStr)
    const items = data?.result?.cmsArticleWebOld || []
    return items.map(item => ({
      title: (item.title || '').replace(/<\/?em>/g, ''),
      content: (item.content || '').replace(/<\/?em>/g, '').slice(0, 200),
      url: item.code ? `http://finance.eastmoney.com/a/${item.code}.html` : '',
      displayTime: item.date || '',
      mediaName: item.mediaName || '',
    }))
  } catch (e) {
    console.warn('[eastmoney] news error:', e.message)
    return []
  }
}

module.exports = { searchStocks, getAnnouncements, getNews }
