import React, { useState, useEffect } from 'react'
import './MessageCard.css'

function MessageCard({ user, message, nextMessage }) {
  // console.log('CARD PROPS', { user, message, nextMessage })

  const [itsMe, setItsMe] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [isDescendant, setIsDescendant] = useState(false)

  useEffect(() => {
    const wasUpdated =
      new Date(message.createdAt).toISOString() !==
      new Date(message.updatedAt).toISOString()

    const descendsNextMessage =
      nextMessage && nextMessage.user._id === message.user._id

    if (user) setItsMe(user._id === message.user._id)
    if (wasUpdated) setUpdated(true)
    if (descendsNextMessage) setIsDescendant(true)
  }, [nextMessage])

  return (
    <div className={`message-card ${itsMe ? 'me' : ''}`}>
      <div className='message-container'>
        {!itsMe && (
          <div className='image-container'>
            <img src={message.user.picture} alt='' />
          </div>
        )}

        <p className='message-content'>{message.text}</p>
      </div>
      {/* <p>{message.text}</p> */}
      {/* <p>itsMe: {`${itsMe}`}</p>
      <p>updated: {`${updated}`}</p>
      <p>isDescendant: {`${isDescendant}`}</p> */}
    </div>
  )
}

export default MessageCard
