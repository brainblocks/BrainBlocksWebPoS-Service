import { postSelect, postInsert } from './postgres'

export function getTransactionsByAddress(address) {
  return postSelect(
    'transactions',
    {
      address: address
    },
    ['*'],
    'ORDER BY created_at DESC'
  )
}

export function addTransaction(tx) {
  return postInsert('transactions', {
    ...tx,
    created_at: new Date()
  })
}
