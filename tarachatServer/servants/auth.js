const pg = require('../db/postgres')
const logger = require('log4js').getLogger(__filename)
logger.level = 'debug'

module.exports = {
  'auth.register': (socket, action, timestamp, sessionid, payload) => {
    const { nickname, email, hashPwd } = payload

    pwd = Buffer.from(hashPwd, 'hex')

    if (nickname && email && pwd) {
      const stmt =
        'INSERT INTO users(email, hashpwd, nickname) VALUES($1, $2, $3) RETURNING *'
      const values = [email, pwd, nickname]
      pg.query(stmt, values, (error, result) => {
        if (error) {
          logger.error(error.stack)

          if (
            error.code === '23505' &&
            error.constraint === 'Users_email_key'
          ) {
            error = 'The Email address has been registered'
          }

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
    } else {
      let key = ''

      if (!nickname) {
        key = 'Nickname'
      } else if (!email) {
        key = 'Email'
      }

      socket.write(
        JSON.stringify({
          success: 0,
          action: action,
          payload: { error: `${key} cannot be empty` }
        })
      )
    }
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
