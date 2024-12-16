import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
// import './App.css'

const WS_URL = import.meta.env.VITE_WS_URL
console.log(WS_URL)

let params = null
let room = null

if (window.location.search) {
  const getQuery = window.location.search.split('?')[1]
  params = getQuery.split('&')
  params.forEach(param => {
    const [key, value] = param.split('=')
    if (key == 'flixmate') room = value
  })
}

// console.log(window.location)

function App() {
  const [connected, setConnected] = useState(null)
  const [user, setUser] = useState(null)
  const [socket, setSocket] = useState(null)
  // console.log(params, room)

  // Checks if the user is still connected
  useEffect(() => {
    chrome.storage.sync.get(['token'], token => {
      if (token) {
        setConnected(token.token)
        chrome.storage.sync.get(['user'], result => {
          setUser(result.user)
          // console.log(result.user)
        })
      }
    })
    setTimeout(() => setConnected(null), 2000)
  }, [connected])

  // connects the socket one time when the user is retreived
  useEffect(() => {
    if (connected && !socket) {
      setSocket(
        io(WS_URL, {
          auth: {
            token: connected,
          },
        })
      )
    }
  }, [connected])

  // Runs on socket connection to set-up the events
  useEffect(() => {
    if (socket) {
      console.log('Trying to join room ', room)
      socket.emit('join-room', room)
      socket.on('joined-room', () => {
        console.log(`Succesfully joined the room ${room}`)
      })
    }
  }, [socket])

  return (
    <div className='flixmateApp'>
      <style>
        {`.flixmateApp{
        position: absolute;
        width: 500px;
        aspect-ratio: 1;
        z-index: 50000;
        top: 0;
        left: 0;
        background-color: white;
        color: black;
        font-size: larger;
        }`}
      </style>
      {connected ? (
        <></>
      ) : (
        //all the wotk should be done inside here, no components outside of this
        <>{user ? user.email : 'Please connect'}</>
      )}
    </div>
  )
}

export default App
