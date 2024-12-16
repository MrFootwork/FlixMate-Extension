// const { io } = require('https://cdn.socket.io/4.8.1/socket.io.esm.min.js')

// const WS_URL = chrome.runtime.getManifest().env.WS_URL

// const urlParams = window.location.search
// const getQuery = urlParams.split('?')[1]
// const params = getQuery.split('&')

// console.log(params)

// let user = null
// let connected = true
// const socket = io()

// getConnectedUSer()

// // checks every second the chrome storage to see if the user is still connected
// setInterval(() => {
//   getConnectedUSer()
//   if (!user) connected = false
// }, 1000)

// function getConnectedUSer() {
//   chrome.storage.sync.get(['token'], token => {
//     if (token) {
//       connected = token.token
//       chrome.storage.sync.get(['user'], result => {
//         user = result.user
//         console.log(result.user)
//       })
//     }
//   })
// }
