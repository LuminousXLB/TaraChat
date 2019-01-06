const { POSTGRES } = require('../privateSetting')
const { Client, Pool } = require('pg')
const logger = require('log4js').getLogger(__filename)
logger.level = 'debug'

const pool = new Pool(POSTGRES)

module.exports = {
  query: (text, params) => {
    return new Promise((resolve, reject) => {
      const start = Date.now()
      pool.query(text, params, (err, res) => {
        const duration = Date.now() - start
        logger.info(`Executed query [${duration}] ${text}`)
        if (res) {
          logger.info(`Rows ${res.rowCount}`)
          resolve(res)
        } else {
          logger.error(err)
          reject(err)
        }
      })
    })
  },
  getClient: callback => {
    pool.connect((err, client, done) => {
      callback(err, client, done)
    })
  }
}
