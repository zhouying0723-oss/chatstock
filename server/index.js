require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const path = require('path')

const stockRouter = require('./routes/stock')
const questionsRouter = require('./routes/questions')
const settingsRouter = require('./routes/settings')

const app = express()
const PORT = process.env.PORT || 3002

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors())
app.use(express.json())

app.use(rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false }))

app.use('/api/stock', stockRouter)
app.use('/api/questions', questionsRouter)
app.use('/api/settings', settingsRouter)

// Serve frontend in production
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), err => {
    if (err) res.status(404).send('Not found')
  })
})

app.listen(PORT, () => console.log(`[chatstock] listening on :${PORT}`))
