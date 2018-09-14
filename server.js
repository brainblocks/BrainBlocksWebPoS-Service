import express from 'express'
import cors from 'cors'
import http from 'http'
import bodyParser from 'body-parser'
import config from './config'
import { getTransactionsByAddress, addTransaction } from './transactions'
import { getCurrency } from './currencies'

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
    .catch(err => {
      console.error('Error in `/transactions/:address` ===', err)
      next(err)
    })
})

/**
 * Add transaction
 */
app.post('/transaction', (req, res, next) => {
  console.log(req.body)
  addTransaction(req.body)
    .then(result => {
      res.json({
        success: true,
        txId: result.id
      })
    })
    .catch(err => {
      console.error('Error in `post` to `transaction` ===', err)
      next(err)
    })
})

/**
 * Get currency price by code
 */
app.get('/currencies/:currencyCode', (req, res, next) => {
  getCurrency(req.params.currencyCode)
    .then(rows => {
      res.json({
        success: true,
        currency: rows
      })
    })
    .catch(err => {
      console.error('Error in `/currencies/:currencyCode` ===', err)
      next(err)
    })
})

server.listen(config.serverPort)
