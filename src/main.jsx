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

function addCSPMetaTag() {
  // Get the head element of the document
  const head = document.getElementsByTagName('head')[0]

  if (head) {
    // Create a new meta tag element
    const meta = document.createElement('meta')

    // Set the content attribute with the CSP directive
    meta.setAttribute('http-equiv', 'Content-Security-Policy')
    meta.setAttribute(
      'content',
      "default-src https: wss: http: 'unsafe-inline' 'unsafe-eval'"
    )

    // Append the new meta tag to the head element
    head.appendChild(meta)
  } else {
    console.error('Head tag not found in the document.')
  }
}

// Call the function to add the CSP meta tag
// addCSPMetaTag()

// loadCSS('flixmate.css', null)

const flixMateRoot = document.createElement('div')
console.log(flixMateRoot, document.querySelector('body'))
document.querySelector('body').appendChild(flixMateRoot)
createRoot(flixMateRoot).render(
  // <StrictMode>
  <App />
  // </StrictMode>
)
