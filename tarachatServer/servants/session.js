const { redisTask, sampleCallback } = require('../db/redis')
const { successResponse, failResponse } = require('./common')
const crypto = require('crypto')
const logger = require('log4js').getLogger(__filename)
logger.level = 'debug'

module.exports = {
  'session.create': (socket, action, timestamp, sessionid, payload) => {
    const { info } = payload

    let hash = crypto.createHash('ripemd160')
    hash.update(crypto.randomBytes(20))
    hash.update(JSON.stringify(info))
    sessionid = hash.digest('base64')

    logger.info('sessionid', sessionid)
    redisTask(client => {
      client.set(`session:${sessionid}`, JSON.stringify(info), sampleCallback)
      client.get(`session:${sessionid}`, sampleCallback)
      client.expire(`session:${sessionid}`, 60 * 30, sampleCallback)
    })

    logger.info('Response session.create')
    socket.write(successResponse(action, { sessionid }))
  }
}
