import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function loadCSS(url, callback) {
  const head = document.getElementsByTagName('head')[0]
  const cssnode = document.createElement('link')

  cssnode.type = 'text/css'
  cssnode.rel = 'stylesheet'
  cssnode.href = url

  cssnode.onreadystatechange = callback
  cssnode.onload = callback

  head.appendChild(cssnode)
}

// loadCSS('flixmate.css', null)

const flixMateRoot = document.createElement('div')
console.log(flixMateRoot, document.querySelector('body'))
document.querySelector('body').appendChild(flixMateRoot)
createRoot(flixMateRoot).render(
  <StrictMode>
    <App />
  </StrictMode>
)
