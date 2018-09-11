import { postSelect } from './postgres'

export async function getTransactionsByAddress(address) {
  return await postSelect(
    'transactions',
    {
      address: address
    },
    ['*']
  )
}
