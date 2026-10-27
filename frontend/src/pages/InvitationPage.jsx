import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getImageUrl, getInvitationBySlug, getPublicAudio } from '../services/api'

function formatDate(date) {
  if (!date) return 'Fecha por confirmar'

  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'long',
  }).format(new Date(`${date}T00:00:00`))
}

function InvitationPage() {
  const { slug } = useParams()
  const [invitation, setInvitation] = useState(null)
  const [audio, setAudio] = useState(null)
  const [musicOn, setMusicOn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadInvitation() {
      try {
        setLoading(true)
        setError('')
        const [data, audioData] = await Promise.all([
          getInvitationBySlug(slug),
          getPublicAudio(slug),
        ])
        setInvitation(data)
        setAudio(audioData)
      } catch (requestError) {
        if (requestError.response?.status === 404) {
          setError('No encontramos esta invitación.')
        } else {
          setError('No pudimos cargar la invitación. Comprueba que el backend esté funcionando.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadInvitation()
  }, [slug])

  if (loading) {
    return <main className="status-screen">Cargando invitación...</main>
  }

  if (error) {
    return <main className="status-screen error-screen">{error}</main>
  }

  const isEditorial = invitation.templateId === 'EDITORIAL_CARDS' || invitation.templateId === 'EDITORIAL_FLORAL_COMBO' || invitation.templateId === 'BOHO_CHIC_MINIMAL'

  return (
    <main
      className={`invitation-page ${isEditorial ? 'theme-editorial-cards' : ''}`}
      style={{
        '--primary-color': invitation.primaryColor || '#7fb3a8',
        '--accent-color': invitation.accentColor || '#b79a62',
        '--invitation-background': invitation.backgroundColor || '#f4f1ea',
        '--invitation-lateral': invitation.lateralColor || invitation.backgroundColor || '#e8efe9',
      }}
    >
      {audio && (
        <div className={isEditorial ? 'editorial-floating-music' : 'music-control'}>
          <audio id="public-wedding-audio" src={getImageUrl(audio.audioUrl)} loop />
          <button
            type="button"
            className={isEditorial ? `floating-audio-pill ${musicOn ? 'is-playing' : ''}` : (musicOn ? 'is-playing' : '')}
            onClick={() => {
              const player = document.getElementById('public-wedding-audio')
              if (musicOn) player.pause()
              else player.play()
              setMusicOn(!musicOn)
            }}
          >
            {isEditorial ? (
              <span className="audio-note-icon">♫</span>
            ) : (
              <span>{musicOn ? 'Pausar música' : 'Activar música'}</span>
            )}
          </button>
        </div>
      )}

      {isEditorial ? (
        <div className="editorial-body-container" style={{ paddingTop: '50px' }}>
          <section className="editorial-card hero-card">
            <div className="card-inner-frame">
              <p className="editorial-eyebrow">Nuestra Boda</p>
              <h1 className="editorial-couple-title">
                <span className="editorial-title-name">{invitation.partnerOneName}</span>
                <span className="editorial-title-amp">&amp;</span>
                <span className="editorial-title-name">{invitation.partnerTwoName}</span>
              </h1>
              <p className="editorial-wedding-date">{formatDate(invitation.weddingDate)}</p>
              <p className="editorial-welcome-quote">
                &ldquo;{invitation.welcomeMessage || 'Nos encantaría compartir este día tan especial contigo.'}&rdquo;
              </p>
              <p className="editorial-public-note" style={{ fontStyle: 'italic', color: 'var(--accent-color, #7A1C2E)' }}>
                La confirmación se realiza mediante el enlace personalizado enviado a cada familia.
              </p>
            </div>
          </section>

          <section className="editorial-card locations-card">
            <h2 className="moment-title">CELEBRACIÓN</h2>
            <p className="moment-venue-name">{invitation.venueName || 'Lugar por confirmar'}</p>
            <p className="moment-venue-address">{invitation.venueAddress || 'Dirección por confirmar'}</p>
          </section>
        </div>
      ) : (
        <>
          <section className="invitation-hero">
            <p className="eyebrow">Nuestra boda</p>
            <h1>{invitation.partnerOneName} <span>&amp;</span> {invitation.partnerTwoName}</h1>
            <p className="invitation-title">{invitation.title}</p>
            <p className="wedding-date">{formatDate(invitation.weddingDate)}</p>

            <div className="hero-divider" aria-hidden="true">✦</div>

            <p className="welcome-text">
              {invitation.welcomeMessage || 'Nos encantaría compartir este día tan especial contigo.'}
            </p>

            <p className="private-invitation-note">
              La confirmación se realiza mediante el enlace personalizado enviado a cada familia.
            </p>
          </section>

          <section className="details-section">
            <p className="eyebrow">Celebración</p>
            <h2>El lugar de nuestro encuentro</h2>
            <p>{invitation.venueName || 'Lugar por confirmar'}</p>
            <p className="muted-text">{invitation.venueAddress || 'Dirección por confirmar'}</p>
          </section>
        </>
      )}
    </main>
  )
}

export default InvitationPage
