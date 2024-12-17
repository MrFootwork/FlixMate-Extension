import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import Messenger from './components/Messenger'

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

function App() {
  const [token, setToken] = useState(null)
  const [savedToken, setSavedToken] = useState(null)
  const [user, setUser] = useState(null)
  const [socket, setSocket] = useState(null)
  const [joined, setJoined] = useState(false)
  const [video, setVideo] = useState(null)

  // Checks if the user is still connected
  useEffect(() => {
    const listener = window.addEventListener('message', message => {
      const { type, data } = message.data
      switch (type) {
        case 'auth': {
          setToken(data.connected)
          setUser(data.user)
          break
        }
        case 'player':
          setVideo(data.video)
          break
        case 'play':
          handlePlay()
          break
        case 'pause':
          handlePause()
          break
        case 'seek':
          handleSeeked(data.time)
          break
      }
    })
    return () => window.removeEventListener('message', listener)
  }, [socket])
  // connects the socket one time when the user is retreived
  useEffect(() => {
    if (token && !socket) {
      setSocket(
        io(WS_URL, {
          auth: { token },
        })
      )
    }
  }, [token])

  // Load image
  // BUG Image doesn't load
  // const imageURL = chrome.runtime.getURL('chat-icon.png')

  // Messenger
  const [messengerIsOpen, setMessengerIsOpen] = useState(false)

  function toggleMessenger() {
    setMessengerIsOpen(prev => !prev)
  }

  // Runs on socket connection to set-up the events
  useEffect(() => {
    if (socket) {
      if (!joined) {
        console.log('Trying to join room ', room)
        socket.emit('join-room', room)
        setJoined(true)
      }

      socket.on('error', error => {
        console.log(error)
        // FIXME Display the Error once the UI is done
      })

      socket.on('joined-room', () => {
        console.log(`Succesfully joined the room ${room}`)
      })

      // Listen for video events from server
      socket.on('netflix-send', ({ eventType, videoTime, eventUser }) => {
        const myRequest = eventUser._id === user._id
        console.log('SOCKET from server: ', eventType)

        if (!video) return
        console.log(`🚀 ~ socket.on ~ video:`, 'My request? ', myRequest)

        switch (eventType) {
          case 'play':
            window.postMessage({ type: 'x-play', data: {} })
            break

          case 'pause':
            window.postMessage({ type: 'x-pause', data: {} })
            break

          case 'seeked':
            window.postMessage({ type: 'x-seek', data: {} })
            break

          default:
            break
        }
      })
      return () => {
        socket.off('error')
        socket.off('joined-room')
        socket.off('netflix-send')
      }
    }
  }, [socket, video])

  // LISTENER FOR VIDEO PLAYER
  // Define event handlers
  const handlePlay = _ => {
    console.log('Video is playing ', socket)
    socket.emit('netflix', {
      type: 'play',
      videoTime: null,
    })
  }

  const handlePause = _ => {
    console.log('Video is paused')
    socket.emit('netflix', {
      type: 'pause',
      videoTime: null,
    })
  }

  const handleSeeked = time => {
    console.log('Video seeked')
    socket.emit('netflix', {
      type: 'seeked',
      videoTime: time,
    })
  }

  return (
    <div className='flixmateApp'>
      {token && user ? (
        <>
          {!messengerIsOpen ? (
            <div className='icon-container' onClick={toggleMessenger}>
              <p>{user.email}</p>
              {/* <img src={imageURL} alt='open chat icon' /> */}
            </div>
          ) : (
            <Messenger toggler={toggleMessenger} />
          )}
        </>
      ) : (
        <>{'Please connect'}</>
      )}

      <style>
        {
          /* CSS */ `.icon-container{
            position: absolute;
            
            aspect-ratio: 1;
            top: 0;
            right: 1rem;
            color: white;
            font-size: x-large;
          }`
        }

        {
          /* CSS */ `.flixmateApp{
            /* App Styling */
            z-index: 50000;

            /* Primary */
            --color-background: #121212;
            --color-background-off: hsl(from var(--color-background) h s calc(l + 5));
            --color-highlight: #e50914;
            --color-text: #f5f5f5;

            /* Secondary */
            --color-background-secondary: #3a4b5b;
            --color-background-secondary-off: hsl(
              from var(--color-background-secondary) h s calc(l - 5)
            );

            /* Neutral */
            --color-neutral: #3a4b5b;
            --color-black: #3a4b5b;
          }`
        }
      </style>
    </div>
  )
}

export default App

// ATTRIBUTIONS
// <a href="https://www.flaticon.com/free-icons/comments" title="comments icons">Comments icons created by Freepik - Flaticon</a>
