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
      socket.on('error', error => {
        console.log(error)
        // Display the Error once the UI is done
      })
      socket.on('joined-room', () => {
        console.log(`Succesfully joined the room ${room}`)
      })
    }
  }, [socket])

  // Load image
  // BUG Image doesn't load
  const imageURL = chrome.runtime.getURL('chat-icon.png')

  // Messenger
  const [messengerIsOpen, setMessengerIsOpen] = useState(false)

  function toggleMessenger() {
    setMessengerIsOpen(prev => !prev)
  }

  return (
    <div className='flixmateApp'>
      {connected ? (
        <></>
      ) : (
        //all the wotk should be done inside here, no components outside of this
        <>
          {user ? (
            <>
              {!messengerIsOpen ? (
                <div className='icon-container' onClick={toggleMessenger}>
                  <p>{user.email}</p>
                  <img src={imageURL} alt='open chat icon' />
                </div>
              ) : (
                <>
                  <div className='messenger-container'>
                    <button onClick={toggleMessenger}>X</button>
                    <p>THIS IS THE MESSENGER</p>
                  </div>
                </>
              )}
            </>
          ) : (
            'Please connect'
          )}
        </>
      )}
      <style>
        {
          /* CSS */ `.icon-container{
            position: absolute;
            
            aspect-ratio: 1;
            z-index: 50000;
            top: 0;
            right: 1rem;
            color: white;
            font-size: x-large;
        }`
        }

        {
          /* CSS */ `.messenger-container{
            position: absolute;
            
            aspect-ratio: 1;
            z-index: 50000;
            top: 0;
            right: 1rem;
            color: white;
            font-size: x-large;
        }`
        }

        {
          //   /* CSS */ `.flixmateApp{
          //     position: absolute;
          //     width: 500px;
          //     aspect-ratio: 1;
          //     z-index: 50000;
          //     top: 0;
          //     left: 0;
          //     background-color: white;
          //     color: black;
          //     font-size: larger;
          // }`
        }
      </style>
    </div>
  )
}

export default App

// ATTRIBUTIONS
// <a href="https://www.flaticon.com/free-icons/comments" title="comments icons">Comments icons created by Freepik - Flaticon</a>
