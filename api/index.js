require('dotenv').config()

const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors({
  origin: '*'
}))

app.get('/', (req, res) => {
  return res.json({ ok: true })
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server started at port ${port}`))
