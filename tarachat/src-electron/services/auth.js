const { ipcMain } = require('electron')
const crypto = require('crypto')
const tarasocket = require('./socket')

ipcMain.on('request.auth.register', (event, arg) => {
  const { nickname, email, password } = arg

  const hmac = crypto.createHmac('sha256', email)
  hmac.update(password)
  const hashPwd = hmac.digest('hex')

  tarasocket.once('auth.register', (success, payload) => {
    event.sender.send('response.auth.register', {
      success,
      arg,
      payload
    })
  })

  tarasocket.send('auth.register', {
    nickname,
    email,
    hashPwd
  })
})

ipcMain.on('request.auth.login', (event, arg) => {
  const { email, password } = arg

  const hmac = crypto.createHmac('sha256', email)
  hmac.update(password)
  const hashPwd = hmac.digest('hex')

  tarasocket.once('auth.login', (success, payload) => {
    event.sender.send('response.auth.login', {
      success,
      arg,
      payload
    })
  })

  tarasocket.send('auth.login', {
    email,
    hashPwd
  })
})

ipcMain.on('request.auth.logout', event => {
  tarasocket.once('auth.logout', (success, payload) => {
    event.sender.send('response.auth.logout', {
      success: true,
      payload
    })
  })

  tarasocket.send('auth.logout')
})
