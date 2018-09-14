import { postSelectID } from './postgres'
import config from './config'

const { DATABASE } = config

export function getCurrency(currencyCode) {
  if (!currencyCode) {
    throw new Error('No currency code')
  }
  if (currencyCode.length > 4) {
    throw new Error('Suspicious currency code')
  }
  return postSelectID(DATABASE.currenciesTable, currencyCode, ['*'])
}
