import { useEffect, useState } from 'react'
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

  return (
    <main className="invitation-page">
      <section className="invitation-hero">
        {audio && <div className="music-control"><audio id="public-wedding-audio" src={getImageUrl(audio.audioUrl)} loop /><button type="button" onClick={() => { const player = document.getElementById('public-wedding-audio'); if (musicOn) player.pause(); else player.play(); setMusicOn(!musicOn) }}>{musicOn ? 'Pausar música' : 'Activar música'}</button></div>}
        <p className="eyebrow">Nuestra boda</p>
        <h1>{invitation.partnerOneName} <span>&amp;</span> {invitation.partnerTwoName}</h1>
        <p className="invitation-title">{invitation.title}</p>
        <p className="wedding-date">{formatDate(invitation.weddingDate)}</p>

        <div className="hero-divider" aria-hidden="true">✦</div>

        <p className="welcome-text">
          Nos encantaría compartir este día tan especial contigo.
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
    </main>
  )
}

export default InvitationPage
