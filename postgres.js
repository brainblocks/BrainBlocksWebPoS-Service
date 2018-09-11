/* @flow */
import { Pool } from 'pg'
import config from './config'
const { DATABASE } = config
let pool

function createPool(): Object {
  if (!DATABASE) {
    throw new Error(`No database config found`)
  }

  return new Pool({
    host: DATABASE.HOST,
    user: DATABASE.USER,
    database: DATABASE.NAME,
    password: DATABASE.PASSWORD,
    port: DATABASE.PORT,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  })
}

export async function postQuery<T>(
  text: string,
  values: Array<string | number> = []
): Promise<Array<T>> {
  pool = pool || createPool()
  // $FlowFixMe
  let client
  try {
    client = await pool.connect()
  } catch (e) {
    console.error('Could not connect to pool', e)
  }
  console.log(text, values)
  let result
  try {
    result = await client.query(text, values)
  } finally {
    client.release()
  }
  console.log(result.rows)
  return result.rows
}

export async function endPool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}

export async function postQuerySingle<T>(
  text: string,
  values: Array<string | number> = []
): Promise<T> {
  let rows = await postQuery(text, values)
  if (rows.length > 1) {
    throw new Error(`Expected single result for query: ${text}, ${JSON.stringify(values)}`)
  }
  return rows[0]
}

export async function postInsert<T>(
  table: string,
  data: { [string]: string | number }
): Promise<T> {
  let keys = Object.keys(data)
  let values = keys.map(key => data[key])

  let query = `
        INSERT INTO ${table} (${keys.join(', ')})
            VALUES (${keys.map((val, i) => `$${(i + 1).toString()}`).join(', ')})
            RETURNING id;
    `

  return await postQuerySingle(query, values)
}

export async function postSelect<T>(
  table: string,
  criteria: { [string]: string },
  columns: Array<string> = ['id'],
  other: string
): Promise<Array<T>> {
  let keys = Object.keys(criteria)
  let values = keys.map(key => criteria[key])

  let query = `
        SELECT ${columns.join(', ')}
            FROM ${table}
            WHERE ${keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ')}
    `
  if (other) {
    query += other
  }
  query += ';'
  console.log(query)
  return await postQuery(query, values)
}

export async function postSelectOne<T>(
  table: string,
  criteria: { [string]: string },
  columns: Array<string> = ['id']
): Promise<T> {
  let rows = await postSelect(table, criteria, columns)

  if (rows.length > 1) {
    throw new Error(`Expected single result for query: ${JSON.stringify(criteria)}`)
  }

  return rows[0]
}

export async function postSelectID<T>(
  table: string,
  id: string,
  columns: Array<string> = ['id']
): Promise<T> {
  return await postSelectOne(table, { id }, columns)
}

export async function postUpdateWhere<T>(
  table: string,
  criteria: { [string]: string },
  data: { [string]: string }
): Promise<T> {
  let keys = Object.keys(data)
  let values = keys.map(key => data[key])

  let criteriaKeys = Object.keys(criteria)
  let criteriaValues = criteriaKeys.map(key => criteria[key])

  let query = `
        UPDATE ${table}
            SET ${keys.map((key, i) => `${key} = $${i + 1}`).join(', ')}
            WHERE (${criteriaKeys
              .map((key, i) => `${key} = $${keys.length + i + 1}`)
              .join(' AND ')})
            AND (${keys.map((key, i) => `${key} != $${i + 1}`).join(' OR ')});
    `

  return await postQuerySingle(query, [...values, ...criteriaValues])
}

export async function postUpdateID<T>(
  table: string,
  id: string,
  data: { [string]: string }
): Promise<T> {
  return await postUpdateWhere(table, { id }, data)
}
