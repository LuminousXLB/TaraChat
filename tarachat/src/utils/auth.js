import ipcCommonClient from './common.js'

export const Register = ({ nickname, email, password }) =>
  ipcCommonClient(
    {
      requestEventName: 'request.auth.register',
      responseEventName: 'response.auth.register'
    },
    { nickname, email, password }
  )

export const Login = ({ email, password }) =>
  ipcCommonClient(
    {
      requestEventName: 'request.auth.login',
      responseEventName: 'response.auth.login'
    },
    { email, password }
  )

export const Logout = () =>
  ipcCommonClient({
    requestEventName: 'request.auth.logout',
    responseEventName: 'response.auth.logout'
  })
