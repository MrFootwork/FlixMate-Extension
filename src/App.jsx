import './App.css'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
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
  const [messages, setMessages] = useState(null)

  async function getRoomMessages() {
    if (!token) return
    const { data } = await axios.get(WS_URL + '/rooms/' + room, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(data)
    setMessages(data.messages)
  }

  useEffect(() => {
    if (messages) return
    getRoomMessages()
  }, [token])

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
          handlePlay(data.time)
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
    setMessengerIsOpen(!messengerIsOpen)
  }

  function sendMessage(text) {
    socket.emit('receive-message', text)
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

      socket.on('new-message', message => {
        console.log('Received new message: ', message, messages)
        setMessages([...messages, message])
      })

      // Listen for video events from server
      socket.on('netflix-send', ({ eventType, videoTime, eventUser }) => {
        const myRequest = eventUser._id === user._id
        console.log('SOCKET from server: ', eventType, videoTime)

        if (!video) return
        console.log(`🚀 ~ socket.on ~ video:`, 'My request? ', myRequest)
        if (myRequest) return

        switch (eventType) {
          case 'play':
            window.postMessage({ type: 'x-play', data: { time: videoTime } })
            break

          case 'pause':
            window.postMessage({ type: 'x-pause', data: {} })
            break

          case 'seeked':
            window.postMessage({ type: 'x-seek', data: { time: videoTime } })
            break

          default:
            break
        }
      })
      return () => {
        socket.off('error')
        socket.off('joined-room')
        socket.off('netflix-send')
        socket.off('new-message')
      }
    }
  }, [socket, video, messages])

  // LISTENER FOR VIDEO PLAYER
  // Define event handlers
  const handlePlay = time => {
    console.log('Video is playing ', socket)
    socket.emit('netflix', {
      type: 'play',
      videoTime: time,
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
    <>
      <div className='flixmateApp'>
        {token && user && socket ? (
          <>
            {!messengerIsOpen ? (
              <div className='icon-container' onClick={toggleMessenger}>
                {/* Or the Flixmate icon */}
                <p>FM</p>
                {/* <img src={imageURL} alt='open chat icon' /> */}
              </div>
            ) : (
              <Messenger
                toggler={toggleMessenger}
                room={room}
                sendMessage={sendMessage}
                messages={messages}
              />
            )}
          </>
        ) : (
          <>{'Please connect'}</>
        )}
      </div>
    </>
  )
}

export default App

// ATTRIBUTIONS
// <a href="https://www.flaticon.com/free-icons/comments" title="comments icons">Comments icons created by Freepik - Flaticon</a>
