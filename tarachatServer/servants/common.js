module.exports = {
  successResponse: payload => {
    return JSON.stringify({ success: 1, payload })
  },
  failResponse: error => {
    return JSON.stringify({ success: 0, payload: { error } })
  }
}
