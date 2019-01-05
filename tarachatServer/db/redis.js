const { REDIS } = require('../privateSetting')
const redis = require('redis')
const logger = require('log4js').getLogger('redis')
logger.level = 'debug'

module.exports = {
  redisTask(task) {
    const client = redis.createClient(REDIS)

    client.on('error', err => {
      logger.error(err)
      client.quit(this.sampleCallback)
    })

    client.on('ready', () => {
      task(client)
      client.quit(this.sampleCallback)
    })
  },
  sampleCallback(err, reply) {
    if (err) {
      logger.error(err)
    } else {
      logger.info(reply)
    }
  },
  sampleTask(client) {
    client.set('test', 'hello', this.sampleCallback)
    client.get('test', this.sampleCallback)
    client.quit(this.sampleCallback)
  }
}

// redisTask(sample);
