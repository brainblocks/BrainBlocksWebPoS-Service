import express from 'express'
import cors from 'cors'
import http from 'http'
import bodyParser from 'body-parser'
import config from './config'
import { getTransactionsByAddress } from './transactions'

const app = express()

app.use(bodyParser.json())
if (config.stage === 'dev') {
  app.use(cors())
}
app.set('json spaces', 2)

const server = http.Server(app)

/**
 * Get transactions for address
 */
app.get('/transactions/:address', (req, res, next) => {
  getTransactionsByAddress(req.params.address)
    .then(rows => {
      res.json({
        success: true,
        transactions: rows
      })
    })
    .catch(e => {})
})

/**
 * Add transaction
 */
app.post('/transaction', (req, res, next) => {})

server.listen(config.serverPort)
