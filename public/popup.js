let user = null
let connected = true

const bodyElement = document.getElementById('main')
console.log(bodyElement, document)

// checks every second the chrome storage to see if the user is still connected
setInterval(() => {
  getConnectedUSer()
  if (!user) connected = false
  bodyElement.innerText = connected
    ? `Connected as ${user.email}`
    : 'Please Connect!'
}, 1000)

function getConnectedUSer() {
  chrome.storage.sync.get(['token'], token => {
    if (token) {
      connected = token.token
      chrome.storage.sync.get(['user'], result => {
        user = result.user
        console.log(result.user)
      })
    }
  })
}
