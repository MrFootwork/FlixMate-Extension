import { useRef } from 'react'
import './Messenger.css'

function Messenger({ toggler, room, messages, sendMessage }) {
  const inputRef = useRef(null)

  function handleSend() {
    sendMessage(inputRef.current.value)
  }
  return (
    <div className='messenger-container'>
      <div className='top-bar'>
        <button className='button-close' onClick={toggler}>
          X
        </button>
        <div>Room : {room}</div>
      </div>
      <div>
        <input type='text' ref={inputRef} />
        <button onClick={handleSend}>Click Me</button>
      </div>
      <div className='messages-container'>
        {/* <MessageCard message={null} /> */}
        {messages.map(message => (
          <p key={message._id}>{message.text}</p>
        ))}
      </div>
    </div>
  )
}

export default Messenger
