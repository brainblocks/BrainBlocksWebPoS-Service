const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const config = require('./config')

const app = express()
app.use(bodyParser.json())
app.set('json spaces', 2)

const server = http.Server(app)

/**
 * Get transactions for address
 */
app.get('/transactions', (req, res, next) => {
  res.json({
    success: true,
    transactions: [
      {
        address: 'xrb_1nanode8ngaakzbck8smq6ru9bethqwyehomf79sae1k7xd47dkidjqzffeg',
        link: 'xrb_1matere8ngaakzbck8smq6ru9bethqwyehomf79sae1k7xd47dkidjqzabcd',
        type: 'receive',
        nanoValue: 2.56,
        raiValue: 2560000000000,
        currency: 'AUD',
        fiatValue: 11.327,
        timestamp: 1536229581120
      },
      {
        address: 'xrb_1nanode8ngaakzbck8smq6ru9bethqwyehomf79sae1k7xd47dkidjqzffeg',
        link: 'xrb_1biadi388ngaakzbck8smq6ru9bethqwyehomf79sae1k7xd47dkidjqzhijk',
        type: 'receive',
        nanoValue: 11.123456,
        raiValue: 111234567890,
        currency: 'USD',
        fiatValue: 45.87234,
        timestamp: 1536229561120
      }
    ]
  })
})

/**
 * Add transaction
 */
app.post('/transaction', (req, res, next) => {
  
})

server.listen(config.serverPort)
