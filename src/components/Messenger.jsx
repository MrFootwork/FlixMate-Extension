import MessageCard from './MessageCard'
import './Messenger.css'
import { useRef, useEffect } from 'react'

function Messenger({ toggler, isOpen, user, room, messages, sendMessage }) {
  const inputRef = useRef(null)

  function handleSendByClick() {
    sendMessage(inputRef.current.value)
    inputRef.current.value = ''
    inputRef.current.blur()
  }

  function handleSendByEnter(e) {
    e.preventDefault()

    if (e.code === 'Enter') {
      sendMessage(inputRef.current.value)
      inputRef.current.value = ''
    }

    if (e.code === 'Escape') {
      inputRef.current.blur()
    }
  }

  useEffect(() => {
    console.log('PROPS', { toggler, isOpen, user, room, messages, sendMessage })
  }, [])

  // Scroll to bottom on first render
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className={`messenger-container ${isOpen ? 'open' : ''}`}>
      <div className='messenger-header'>
        <h2>Room: {room.name}</h2>
        <button onClick={toggler}>
          <p>X</p>
        </button>
      </div>

      <div className='messages-container'>
        <div className='messages-history-container'>
          {messages &&
            messages.map((message, i) => (
              <MessageCard
                key={message._id}
                user={user}
                message={message}
                nextMessage={messages[i + 1] || null}
              />
            ))}
          <div ref={bottomRef}></div>
        </div>
      </div>

      <div className='input-container'>
        <input
          type='text'
          ref={inputRef}
          onKeyUp={handleSendByEnter}
          placeholder='Type a message...'
        />
        <button onClick={handleSendByClick}>
          <p>Send</p>
        </button>
      </div>
    </div>
  )
}

export default Messenger
