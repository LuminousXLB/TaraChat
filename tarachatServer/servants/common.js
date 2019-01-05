module.exports = {
  successResponse: (action, payload) => {
    return JSON.stringify({ success: 1, action, payload })
  },
  failResponse: (action, error) => {
    return JSON.stringify({ success: 0, action, payload: { error } })
  }
}
