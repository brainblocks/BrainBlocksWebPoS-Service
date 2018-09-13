import { postSelect, postInsert } from './postgres'
import { isValidNanoAddress } from './nano'
import config from './config'

const { DATABASE } = config

export function getTransactionsByAddress(address) {
  if (!address) {
    throw new Error('No address')
  }
  if (!isValidNanoAddress(address)) {
    throw new Error('Invalid address')
  }
  return postSelect(
    DATABASE.transactionsTable,
    {
      address: address
    },
    ['*'],
    'ORDER BY created_at DESC'
  )
}

export function addTransaction(tx) {
  if (!tx) {
    throw new Error('No transaction')
  }
  if (!tx.hasOwnProperty('address') || !isValidNanoAddress(tx.address)) {
    throw new Error('Missing or invalid address')
  }
  if (!tx.hasOwnProperty('link') || !isValidNanoAddress(tx.link)) {
    throw new Error('Missing or invalid `link` address')
  }
  if (
    !tx.hasOwnProperty('type') ||
    !tx.hasOwnProperty('nano_value') ||
    !tx.hasOwnProperty('currency') ||
    !tx.hasOwnProperty('fiat_value') ||
    !tx.hasOwnProperty('send_block') ||
    !tx.hasOwnProperty('token')
  ) {
    throw new Error('Transaction is missing a required attribute')
  }
  return postInsert(DATABASE.transactionsTable, {
    ...tx,
    created_at: new Date()
  })
}
