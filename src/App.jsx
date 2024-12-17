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

  // Checks if the user is still connected
  useEffect(() => {
    chrome.storage.sync.get(['token'], tokenResponse => {
      if (tokenResponse) {
        setToken(tokenResponse.token)
        setSavedToken(tokenResponse.token)

        chrome.storage.sync.get(['user'], userResponse => {
          setUser(userResponse.user)
        })
      }
    })

    // Necessary to get a fresh token, if user data changed
    setTimeout(() => setToken(null), 2000)
  }, [token])

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
  const imageURL = chrome.runtime.getURL('chat-icon.png')

  // Messenger
  const [messengerIsOpen, setMessengerIsOpen] = useState(false)

  function toggleMessenger() {
    setMessengerIsOpen(prev => !prev)
  }

  // Runs on socket connection to set-up the events
  useEffect(() => {
    if (socket) {
      console.log('Trying to join room ', room)
      socket.emit('join-room', room)

      socket.on('error', error => {
        console.log(error)
        // FIXME Display the Error once the UI is done
      })

      socket.on('joined-room', () => {
        console.log(`Succesfully joined the room ${room}`)
      })

      // Listen for video events from server
      socket.on('netflix', ({ eventType, videoTime, user }) => {
        console.log('SOCKET from server: ', socket.rooms)

        const video = document.querySelector('video')
        console.log(`🚀 ~ socket.on ~ video:`, video.currentTime)

        switch (eventType) {
          case 'play':
            video.currentTime = videoTime
            video.play()
            console.log('Playing by ', user.name)
            break

          case 'pause':
            video.pause()
            console.log('Paused by ', user.name)
            break

          case 'seeked':
            video.currentTime = videoTime
            console.log('Seeked by ', user.name)
            break

          default:
            break
        }
      })
    }
  }, [socket])

  // LISTENER FOR VIDEO PLAYER
  // Define event handlers
  const handlePlay = video => {
    console.log('Video is playing', video.currentTime)
    socket.emit('netflix', {
      type: 'play',
      videoTime: video.currentTime,
    })
  }

  const handlePause = video => {
    console.log('Video is paused', video.currentTime)
    socket.emit('netflix', {
      type: 'pause',
      videoTime: video.currentTime,
    })
  }

  const handleSeeked = video => {
    console.log('Video seeked', video.currentTime)
    socket.emit('netflix', {
      type: 'seeked',
      videoTime: video.currentTime,
    })
  }

  // Grab the video element dynamically
  useEffect(() => {
    const videoElement = document.querySelector('video')

    if (!videoElement) {
      console.error('Video element not found!')
      return
    } else {
      console.log('Video element found 🎉')
    }

    // Attach event listeners
    videoElement.addEventListener('play', () => handlePlay(videoElement))
    videoElement.addEventListener('pause', () => handlePause(videoElement))
    videoElement.addEventListener('seeked', () => handleSeeked(videoElement))

    // Cleanup function to remove event listeners
    return () => {
      videoElement.removeEventListener('play', () => handlePlay(videoElement))
      videoElement.removeEventListener('pause', () => handlePause(videoElement))
      videoElement.removeEventListener('seeked', () =>
        handleSeeked(videoElement)
      )
    }
  }, [document.querySelector('video')])

  return (
    <div className='flixmateApp'>
      {token && user ? (
        <>
          {!messengerIsOpen ? (
            <div className='icon-container' onClick={toggleMessenger}>
              <p>{user.email}</p>
              <img src={imageURL} alt='open chat icon' />
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
