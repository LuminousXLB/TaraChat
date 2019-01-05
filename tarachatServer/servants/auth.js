const pg = require('../db/postgres')
const logger = require('log4js').getLogger(__filename)
logger.level = 'debug'

module.exports = {
  'auth.register': (socket, action, timestamp, sessionid, payload) => {
    const { nickname, email, hashPwd } = payload
    const stmt =
      'INSERT INTO users(email, hashpwd, nickname) VALUES($1, $2, $3) RETURNING *'
    const values = [email, Buffer.from(hashPwd, 'hex'), nickname]
    pg.query(stmt, values, (error, result) => {
      if (error) {
        logger.error(error.stack)
        socket.write(
          JSON.stringify({
            success: 0,
            action: action,
            payload: { error }
          })
        )
      } else {
        socket.write(
          JSON.stringify({
            success: 1,
            action: action,
            payload: result
          })
        )
      }
    })
  },
  'auth.login': (socket, action, timestamp, sessionid, payload) => {
    socket.write(
      JSON.stringify({
        success: 1,
        action: action
      })
    )
  },
  'auth.logout': (socket, action, timestamp, sessionid, payload) => {
    socket.write(
      JSON.stringify({
        success: 1,
        action: action
      })
    )
  }
}
