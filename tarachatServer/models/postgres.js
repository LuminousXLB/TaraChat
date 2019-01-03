const { POSTGRES } = require('../privateSetting')
const { Client, Pool } = require('pg')
const logger = require('log4js').getLogger('postgres')
logger.level = 'debug'

const pool = new Pool(POSTGRES)

module.exports = {
  query: (text, params, callback) => {
    const start = Date.now()
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res.rowCount })
      callback(err, res)
    })
  },
  getClient: callback => {
    pool.connect((err, client, done) => {
      callback(err, client, done)
    })
  }
}
