let connected = null
let user = null
function getConnectedUSer() {
  chrome.storage.sync.get(['token'], token => {
    if (token) {
      connected = token.token
      chrome.storage.sync.get(['user'], result => {
        user = result.user
        // console.log(result.user)
      })
    }
  })
}

setInterval(() => {
  getConnectedUSer()
  if (connected && user) {
    // console.log(connected, user)
    window.postMessage({ type: 'auth', data: { connected, user } })
  }
}, 1000)
