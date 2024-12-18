// console.log(window.netflix)
// console.log(window.netflix.appContext.state.playerApp.getAPI().videoPlayer)

function getVideoPlayer() {
  let e = window.netflix.appContext.state.playerApp.getAPI().videoPlayer
  let t = e.getAllPlayerSessionIds().find(val => val.includes('watch'))
  return e.getVideoPlayerBySessionId(t)
}

function convertMillisToTimestamp(millis) {
  return new Date(millis).toISOString().slice(11, 19)
}

let player = getVideoPlayer()
let videoElement = document.querySelector('video')
let frozen = false
// console.log(player)

function setUpEvents() {
  videoElement.addEventListener('play', () => {
    console.log('Play Event ')
    if (frozen) return
    window.postMessage({
      type: 'play',
      data: { time: player.getCurrentTime() },
    })
  })
  videoElement.addEventListener('pause', () => {
    console.log('Pause Event')
    if (frozen) return
    window.postMessage({ type: 'pause', data: {} })
  })
  videoElement.addEventListener('seeked', e => {
    console.log('Seek Event')
    if (frozen) return
    frozen = true
    setTimeout(() => (frozen = false), 1000)
    window.postMessage({
      type: 'seek',
      data: { time: player.getCurrentTime() },
    })
  })
}

const interval = setInterval(() => {
  player = getVideoPlayer()
  videoElement = document.querySelector('video')
  if (player && videoElement) {
    console.log('Found player: ', player)
    window.postMessage({ type: 'player', data: { video: true } })
    setUpEvents()
    clearInterval(interval)
  }
}, 2000)

// const domPlayer = document.querySelector('video')
// window.postMessage({ type: 'player', data: player })

window.addEventListener('message', message => {
  // console.log('Received a message ', message)
  const { type, data } = message.data
  if (frozen) return
  switch (type) {
    case 'x-play': {
      console.log('Received a message ', message)
      if (!player.isPlaying()) {
        console.log(data.time)
        player.seek(data.time)
        player.play()
      }
      break
    }
    case 'x-pause': {
      console.log('Received a message ', message)
      if (!player.isPaused()) player.pause()
      break
    }
    case 'x-seek': {
      console.log('Received a message ', message)
      player.seek(convertMillisToTimestamp(data.time))
      player.play()
      setTimeout(() => {
        frozen = false
      }, 2000)
    }
  }
})
