let user = null

const API_URL = chrome.runtime.getManifest().env.API_URL

function connectUser() {
  chrome.storage.sync.get(['token'], token => {
    console.log('Getting', token)
    if (!token) return

    fetch(API_URL + '/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token}`,
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        user = data
        chrome.storage.sync.set({ user: data })
        console.log(user)
      })
      .catch(error => console.log(error))
  })
}

document.addEventListener('FlixMateConnect', e => {
  console.log('Connected to FlixMate extension ', e)
  chrome.storage.sync.set({ token: e.detail.jwt })
  connectUser()
})

document.addEventListener('FlixMateDisconnect', () => {
  console.log('Disconnected from the FlixMate extension')
  chrome.storage.sync.clear()
  user = null
})
