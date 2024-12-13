import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [connected, setConnected] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    chrome.storage.sync.get(['token'], token => {
      if (token) {
        setConnected(token.token)
        chrome.storage.sync.get(['user'], result => {
          setUser(result.user)
          console.log(result.user)
        })
      }
    })
    setTimeout(() => setConnected(null), 2000)
  }, [connected])

  return <>{user ? user.email : 'Please connect'}</>
}

export default App
