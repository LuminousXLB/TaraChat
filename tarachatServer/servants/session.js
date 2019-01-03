const { redisTask, sampleCallback } = require('../models/redis')
const crypto = require('crypto')
const logger = require('log4js').getLogger(__filename)

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

    socket.write(
      JSON.stringify({
        success: 1,
        action: action,
        payload: { sessionid }
      })
    )
  }
}
