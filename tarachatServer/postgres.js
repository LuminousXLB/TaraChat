const { Client } = require('pg')
const logger = require('log4js').getLogger('postgres')
const { POSTGRES } = require('./privateSetting')
logger.level = 'debug'

const client = new Client(POSTGRES)

client.connect()

logger.info('connected')

client.query('SET search_path TO test', (error, result) => {
  if (error) {
    logger.error(error.stack)
  } else {
    client.query(`SELECT * FROM "Users"`, (error, result) => {
      if (error) {
        logger.error(error.stack)
      } else {
        console.log(result)
      }
      client.end()
    })
  }
})
