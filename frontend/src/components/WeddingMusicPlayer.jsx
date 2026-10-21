import React, { useEffect, useState } from 'react'
import { getImageUrl } from '../services/api'

export function WeddingMusicPlayer({ audio, musicOn, toggleMusic, audioId = 'wedding-audio' }) {
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoop, setIsLoop] = useState(true)
  const [isShuffle, setIsShuffle] = useState(false)

  useEffect(() => {
    const player = document.getElementById(audioId)
    if (!player) return

    const handleTimeUpdate = () => {
      setCurrentTime(player.currentTime)
      if (player.duration) {
        setDuration(player.duration)
        setProgress((player.currentTime / player.duration) * 100)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(player.duration || 0)
    }

    player.addEventListener('timeupdate', handleTimeUpdate)
    player.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      player.removeEventListener('timeupdate', handleTimeUpdate)
      player.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [audioId])

  const handleSeek = (e) => {
    const val = Number(e.target.value)
    setProgress(val)
    const player = document.getElementById(audioId)
    if (player && player.duration) {
      player.currentTime = (val / 100) * player.duration
    }
  }

  const handlePrev = () => {
    const player = document.getElementById(audioId)
    if (player) {
      player.currentTime = 0
    }
  }

  const handleNext = () => {
    const player = document.getElementById(audioId)
    if (player) {
      player.currentTime = 0
      if (!musicOn) toggleMusic()
    }
  }

  const handleToggleLoop = () => {
    const player = document.getElementById(audioId)
    if (player) {
      player.loop = !player.loop
      setIsLoop(player.loop)
    }
  }

  const handleToggleShuffle = () => {
    setIsShuffle(!isShuffle)
  }

  if (!audio || !audio.audioUrl) {
    return null
  }

  return (
    <div className="wedding-music-player-widget" aria-label="Reproductor de música de los novios">
      <p className="music-player-prompt">Dale play a nuestra canción</p>
      
      {/* Barra de progreso interactiva con punto/scrubber */}
      <div className="music-player-progress-container">
        <div className="music-player-track">
          <div className="music-player-fill" style={{ width: `${progress}%` }} />
          <div className="music-player-scrubber" style={{ left: `${progress}%` }} />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleSeek}
          className="music-player-range-input"
          aria-label="Progreso de la canción"
        />
      </div>

      {/* Fila de controles: Shuffle, Prev, Play/Pause circular, Next, Repeat */}
      <div className="music-player-controls-row">
        <button
          type="button"
          className={`music-ctrl-btn shuffle-btn ${isShuffle ? 'active' : ''}`}
          onClick={handleToggleShuffle}
          title="Aleatorio"
          aria-label="Modo aleatorio"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8" />
            <line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" />
            <line x1="15" y1="15" x2="21" y2="21" />
            <line x1="4" y1="4" x2="9" y2="9" />
          </svg>
        </button>

        <button
          type="button"
          className="music-ctrl-btn prev-btn"
          onClick={handlePrev}
          title="Reiniciar canción"
          aria-label="Canción anterior"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        <button
          type="button"
          className="music-play-circle-btn"
          onClick={toggleMusic}
          title={musicOn ? 'Pausar canción' : 'Reproducir canción'}
          aria-label={musicOn ? 'Pausar' : 'Reproducir'}
        >
          {musicOn ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          className="music-ctrl-btn next-btn"
          onClick={handleNext}
          title="Siguiente"
          aria-label="Siguiente canción"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>

        <button
          type="button"
          className={`music-ctrl-btn loop-btn ${isLoop ? 'active' : ''}`}
          onClick={handleToggleLoop}
          title={isLoop ? 'Repetición activada' : 'Repetición desactivada'}
          aria-label="Repetir canción"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </button>
      </div>

      {audio.title && (
        <p className="music-player-song-title">♫ {audio.title}</p>
      )}
    </div>
  )
}
