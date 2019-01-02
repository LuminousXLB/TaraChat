const { ipcRenderer } = require('electron')

export function Register ({ nickname, email, password }) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('response.auth.register', (event, arg) => {
      if (arg.success) {
        resolve(arg)
      } else {
        reject(arg.error)
      }
    })

    ipcRenderer.send('request.auth.register', { nickname, email, password })
  })
}

export function Login (email, password) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('response.auth.login', (event, arg) => {
      if (arg.success) {
        resolve(arg)
      } else {
        reject(arg.error)
      }
    })

    ipcRenderer.send('request.auth.login', { email, password })
  })
}

export function Logout () {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('response.auth.logout', (event, arg) => {
      if (arg.success) {
        resolve(arg)
      } else {
        reject(arg.error)
      }
    })

    ipcRenderer.send('request.auth.logout')
  })
}
