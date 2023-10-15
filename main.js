import WaveSurfer from "wavesurfer.js";

const playIcon = "/img/icons/play-fill.svg"
const pauseIcon = "/img/icons/pause-line.svg"

const playlist = [
  {
    album: 'cover1.jpg',
    title: 'Never Hide',
    artist: 'Wolsh',
    audio: 'audio1.mp3'
  },
  {
    album: 'cover2.jpg',
    title: 'Watching Anime',
    artist: 'Odd Future',
    audio: 'audio2.mp3'
  },
  {
    album: 'cover3.jpg',
    title: 'Crying In Your Sleep',
    artist: 'Raxeller',
    audio: 'audio3.mp3'
  }
]

let currentSong = 0
const timeEl = document.querySelector('#time')
const durationEl = document.querySelector('#duration')
const playButton = document.querySelector('#play-button')
const albumCover = document.querySelector('#album-cover')
const songTitle = document.querySelector('#title')
const songArtist = document.querySelector('#artist')
const waveForm = document.querySelector('#waveform')
const forwardButton = document.querySelector('.forward')
const backButton = document.querySelector('.backward')
const nextButton = document.querySelector('#next-button')
const prevButton = document.querySelector('#prev-button')

const wavesurfer = WaveSurfer.create({
  container: '#waveform',
  height: 40,
  waveColor: "#a169ff",
  progressColor: "rgb(70, 0, 162)",
  cursorWidth: 0,
  barWidth: 3,
  barGap: 3,
  barRadius: 10,
  barHeight: 0.8,
  barAlign: "",
  minPxPerSec: 1,
  fillParent: true,
  mediaControls: false,
  autoplay: false,
  interact: true,
  dragToSeek: false,
  hideScrollbar: true,
  audioRate: 1,
  autoScroll: true,
  autoCenter: true,
  sampleRate: 8000,
})

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secondsRemainder = Math.round(seconds) % 60
  const paddedSeconds = `0${secondsRemainder}`.slice(-2)
  return `${minutes}:${paddedSeconds}`
}


wavesurfer.on('decode', (duration) => {
  let zoom = 0

  durationEl.textContent = formatTime(duration)
  wavesurfer.zoom(zoom)


  waveForm.addEventListener('wheel', (e) => {
    if (e.wheelDelta > 0) {
      zoom += 5
      if (zoom > 100) {
        zoom = 100
      }
      wavesurfer.zoom(zoom)
    } else {
      zoom -= 5
      if (zoom < 0) {
        zoom = 0
      }
      wavesurfer.zoom(zoom)
    }
    console.log(zoom)
  })

})

wavesurfer.on('timeupdate', (currentTime) => (timeEl.textContent = formatTime(currentTime)))
wavesurfer.on('play', () => {
  albumCover.style.animationPlayState = "running"
  playButton.querySelector("img").src = pauseIcon
})
wavesurfer.on('pause', () => {
  albumCover.style.animationPlayState = "paused"
  playButton.querySelector("img").src = playIcon
})

playButton.addEventListener('click', async () => {
  playButton.classList.toggle('active')
  await wavesurfer.playPause()
})

wavesurfer.on('interaction', async () => {
  await wavesurfer.play()
})

wavesurfer.once('decode', () => {

  forwardButton.onclick = () => {
    wavesurfer.skip(5)
  }

  backButton.onclick = () => {
    wavesurfer.skip(-5)
  }
})


const changeSong = async (index) => {
  const isPlaying = wavesurfer.isPlaying()
  const currentSong = playlist[index]
  songTitle.innerText = currentSong.title
  songArtist.innerText = currentSong.artist
  albumCover.style.backgroundImage = `url('img/${currentSong.album}')`
  await wavesurfer.load(`/songs/${currentSong.audio}`)
  if (isPlaying) {
    await wavesurfer.play()
  }
}

addEventListener('load', async () => {
  await changeSong(currentSong)
})

nextButton.addEventListener('click', async () => {
  if (playlist[currentSong+1] !== undefined) {
    currentSong+= 1
    await changeSong(currentSong)
  }
})
prevButton.addEventListener('click', async () => {
  if (playlist[currentSong-1] !== undefined) {
    currentSong-= 1
    await changeSong(currentSong)
  }
})



