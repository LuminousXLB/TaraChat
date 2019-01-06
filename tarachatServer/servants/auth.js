const pg = require('../db/postgres')
const { successResponse, failResponse } = require('./common')
const logger = require('log4js').getLogger(__filename)
logger.level = 'debug'

module.exports = {
  'auth.register': (socket, action, timestamp, sessionid, payload) => {
    const { nickname, email, hashPwd } = payload

    if (!nickname) {
      socket.write(failResponse(action, `Nickname cannot be empty`))
      return
    }

    if (!email) {
      socket.write(failResponse(action, `Email cannot be empty`))
      return
    }

    if (!hashPwd) {
      socket.write(failResponse(action, `Password cannot be empty`))
      return
    }

    pwd = Buffer.from(hashPwd, 'hex')

    pg.query(
      'INSERT INTO users(email, hashpwd, nickname) VALUES($1, $2, $3) RETURNING *',
      [email, pwd, nickname],
      (error, result) => {
        if (error) {
          logger.error(error.stack)

          if (
            error.code === '23505' &&
            error.constraint === 'Users_email_key'
          ) {
            error = 'The Email address has been registered'
          }

          socket.write(failResponse(action, error))
        } else {
          socket.write(
            successResponse(action, { nickname: result.rows[0].nickname })
          )
        }
      }
    )
  },
  'auth.login': (socket, action, timestamp, sessionid, payload) => {
    const { email, hashPwd } = payload
    if (!email) {
      socket.write(failResponse(action, 'Email cannot be empty'))
      return
    }

    pg.query(
      'SELECT nickname, hashpwd FROM users WHERE email=$1',
      [email],
      (error, result) => {
        if (error) {
          logger.error(error.stack)
          socket.write(failResponse(action, error))
        } else {
          qHashPwd = Buffer.from(result.rows[0].hashpwd)
          // logger.info(result.rows[0])
          if (qHashPwd.toString('hex') === hashPwd) {
            socket.write(
              successResponse(action, { nickname: result.rows[0].nickname })
            )
          } else {
            // logger.warn(qHashPwd.toString('hex'), hashPwd)
            socket.write(failResponse(action, 'Wrong Password or Email'))
          }
        }
      }
    )
  },
  'auth.logout': (socket, action, timestamp, sessionid, payload) => {
    socket.write(successResponse(action))
  }
}
