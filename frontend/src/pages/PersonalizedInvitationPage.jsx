import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getInvitationBySlug, getPublicAudio, getPublicPhotos, getRsvpByToken, submitRsvp } from '../services/api'
import { FloralRomanceTemplate } from '../components/FloralRomanceTemplate'
import { EditorialCardsTemplate } from '../components/EditorialCardsTemplate'
import { EditorialFloralComboTemplate } from '../components/EditorialFloralComboTemplate'
import { BohoRusticTemplate } from '../components/BohoRusticTemplate'

function formatDate(date) {
  if (!date) return 'Fecha por confirmar'
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' })
    .format(new Date(`${date}T00:00:00`))
}

function createGuest() {
  return { fullName: '', ageGroup: 'ADULT', allergies: '', attendanceStatus: 'CONFIRMED' }
}

function parseList(value) {
  try {
    const parsed = JSON.parse(value || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function PersonalizedInvitationPage() {
  const { slug, token } = useParams()
  const [invitation, setInvitation] = useState(null)
  const [rsvp, setRsvp] = useState(null)
  const [photos, setPhotos] = useState([])
  const [audio, setAudio] = useState(null)
  const [musicOn, setMusicOn] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [guests, setGuests] = useState([])
  const [attendeesCount, setAttendeesCount] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirmationSaved, setConfirmationSaved] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    async function loadPage() {
      try {
        const [invitationData, rsvpData, photoData, audioData] = await Promise.all([
          getInvitationBySlug(slug),
          getRsvpByToken(slug, token),
          getPublicPhotos(slug),
          getPublicAudio(slug),
        ])
        setInvitation(invitationData)
        setRsvp(rsvpData)
        setPhotos(photoData)
        setAudio(audioData)
        const confirmedGuests = rsvpData.guests?.filter((guest) => guest.attendanceStatus === 'CONFIRMED') || []
        setGuests(confirmedGuests)
        setAttendeesCount(confirmedGuests.length ? String(confirmedGuests.length) : '')
      } catch (requestError) {
        setError(requestError.response?.status === 404
          ? 'Este enlace de invitación no existe o ya no está disponible.'
          : 'No pudimos cargar la invitación. Comprueba que el backend esté activo.')
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [slug, token])

  const heroPhotos = photos.filter((photo) => photo.visible && photo.section === 'HERO')
  const storyPhotos = photos.filter((photo) => photo.visible && photo.section === 'STORY')
  const footerPhoto = photos.find((photo) => photo.visible && photo.section === 'FOOTER')
  const schedule = parseList(invitation?.scheduleJson)
  const faqs = parseList(invitation?.faqJson)
  const tables = parseList(invitation?.tablesJson)
  const locations = parseList(invitation?.locationsJson)
  const giftOptions = parseList(invitation?.giftOptionsJson)
  const rawAddress = invitation?.venueAddress || ''
  const visibleAddress = /^https?:\/\//i.test(rawAddress) ? '' : rawAddress
  const mapQuery = visibleAddress || invitation?.venueName
  const mapExternalUrl = invitation?.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery || '')}`
  const envelopeMonogram = [invitation?.partnerOneName?.trim()?.[0], invitation?.partnerTwoName?.trim()?.[0]].filter(Boolean).join(' & ')

  useEffect(() => {
    if (heroPhotos.length < 2) return undefined
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroPhotos.length)
    }, 4500)
    return () => window.clearInterval(timer)
  }, [heroPhotos.length])

  useEffect(() => {
    if (!invitation?.weddingDate) return undefined
    const updateCountdown = () => {
      const target = new Date(`${invitation.weddingDate}T00:00:00`).getTime()
      const remaining = Math.max(0, target - Date.now())
      const totalSeconds = Math.floor(remaining / 1000)
      setCountdown({
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      })
    }
    updateCountdown()
    const timer = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(timer)
  }, [invitation?.weddingDate])

  const confirmedCount = useMemo(
    () => guests.filter((guest) => guest.attendanceStatus === 'CONFIRMED').length,
    [guests],
  )

  function updateGuest(index, field, value) {
    setGuests((current) => current.map((guest, guestIndex) => (
      guestIndex === index ? { ...guest, [field]: value } : guest
    )))
  }

  function changeAttendeesCount(value) {
    const count = Number(value)
    setAttendeesCount(value)
    setGuests((current) => Array.from({ length: count }, (_, index) => current[index] || createGuest()))
  }

  function openMap(url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (guests.some((guest) => !guest.fullName.trim())) {
      setError('Completa el nombre de cada persona registrada.')
      return
    }

    try {
      setSaving(true)
      await submitRsvp(slug, token, { guests, message })
      setSuccess('Tu confirmación fue registrada correctamente.')
      setConfirmationSaved(true)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No pudimos guardar tu confirmación.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleMusic() {
    const player = document.getElementById('wedding-audio')
    if (!player) return
    if (musicOn) {
      player.pause()
      setMusicOn(false)
      return
    }
    try {
      await player.play()
      setMusicOn(true)
    } catch {
      setError('Pulsa nuevamente el control para reproducir la música.')
    }
  }

  async function openInvitation() {
    setIsOpening(true)
    const player = document.getElementById('wedding-audio')
    if (audio) {
      try {
        await player?.play()
        setMusicOn(true)
      } catch {
        // Reproducción de audio en dispositivos móviles sujeta a interacción del usuario
      }
    }
    window.setTimeout(() => setIsOpened(true), 620)
  }

  if (loading) return <main className="status-screen">Cargando tu invitación...</main>
  if (error && !rsvp) return <main className="status-screen error-screen">{error}</main>

  const templateId = invitation?.templateId || 'FLORAL_ROMANCE'
  const isEditorial = templateId === 'EDITORIAL_CARDS' || templateId === 'EDITORIAL_FLORAL_COMBO'
  const isBoho = templateId === 'BOHO_CHIC_MINIMAL'

  const templateProps = {
    invitation,
    rsvp,
    photos,
    audio,
    musicOn,
    toggleMusic,
    isOpened,
    isOpening,
    openInvitation,
    guests,
    attendeesCount,
    confirmedCount,
    message,
    setMessage,
    saving,
    error,
    success,
    confirmationSaved,
    heroPhotos,
    heroIndex,
    setHeroIndex,
    storyPhotos,
    footerPhoto,
    countdown,
    locations,
    schedule,
    giftOptions,
    faqs,
    tables,
    visibleAddress,
    mapQuery,
    mapExternalUrl,
    envelopeMonogram,
    updateGuest,
    changeAttendeesCount,
    openMap,
    handleSubmit,
    formatDate,
  }

  const themeClass = isBoho
    ? 'theme-boho-rustic'
    : isEditorial
      ? 'theme-editorial-cards'
      : 'theme-floral-romance'

  const ceremonyLocation = locations.find((loc) => /ceremonia|iglesia|templo|misa/i.test(loc.type || loc.name)) || locations[0]
  const receptionLocation = locations.find((loc) => /recepci|fiesta|celebraci|sal[oó]n|jard[ií]n/i.test(loc.type || loc.name)) || locations[1] || locations[0]

  return (
    <main
      className={`personalized-page ${themeClass}`}
      style={{
        '--primary-color': invitation.primaryColor || '#7fb3a8',
        '--accent-color': invitation.accentColor || '#b79a62',
        '--invitation-background': invitation.backgroundColor || '#f4f1ea',
      }}
    >
      {templateId === 'EDITORIAL_CARDS' && <EditorialCardsTemplate {...templateProps} />}
      {templateId === 'EDITORIAL_FLORAL_COMBO' && <EditorialFloralComboTemplate {...templateProps} />}
      {templateId === 'BOHO_CHIC_MINIMAL' && <BohoRusticTemplate {...templateProps} />}
      {templateId !== 'EDITORIAL_CARDS' && templateId !== 'EDITORIAL_FLORAL_COMBO' && templateId !== 'BOHO_CHIC_MINIMAL' && (
        <FloralRomanceTemplate {...templateProps} />
      )}

      {/* SECCIÓN OFICIAL DE PASE DE ACCESO / ENTRADA VIP PARA IMPRESIÓN Y DESCARGA PDF */}
      <section className="print-access-pass" aria-label="Pase Oficial de Acceso">
        <div className="pass-card-sheet">
          <div className="pass-card-corner tl" />
          <div className="pass-card-corner tr" />
          <div className="pass-card-corner bl" />
          <div className="pass-card-corner br" />

          <div className="pass-card-header">
            <span className="pass-badge-pill">PASE DE ACCESO VIP</span>
            <p className="pass-card-nuestra-boda">NUESTRA BODA</p>
            <h1 className="pass-card-couple">
              {invitation.partnerOneName} &amp; {invitation.partnerTwoName}
            </h1>
            <p className="pass-card-date">{formatDate(invitation.weddingDate)}</p>
          </div>

          <div className="pass-card-divider" />

          <div className="pass-card-guest-info">
            <div className="pass-info-row">
              <span className="pass-label">FAMILIA / INVITADO DE HONOR:</span>
              <strong className="pass-value-highlight">{rsvp?.contactName || 'Invitado Especial'}</strong>
            </div>
            <div className="pass-info-row">
              <span className="pass-label">PASES CONFIRMADOS:</span>
              <strong className="pass-value-badge">{confirmedCount || rsvp?.maxGuestsAllowed || 1} persona(s)</strong>
            </div>

            {guests.filter((g) => g.attendanceStatus === 'CONFIRMED' && g.fullName).length > 0 && (
              <div className="pass-guests-names-list">
                <span className="pass-label">ASISTENTES REGISTRADOS:</span>
                <ul>
                  {guests.filter((g) => g.attendanceStatus === 'CONFIRMED' && g.fullName).map((g, idx) => (
                    <li key={idx}>{g.fullName}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pass-card-divider" />

          <div className="pass-card-logistics">
            {ceremonyLocation && (
              <div className="pass-logistic-item">
                <span className="pass-logistic-title">CEREMONIA</span>
                <p className="pass-logistic-venue">{ceremonyLocation.name}</p>
                <p className="pass-logistic-address">{ceremonyLocation.address || visibleAddress}</p>
              </div>
            )}
            {receptionLocation && (
              <div className="pass-logistic-item">
                <span className="pass-logistic-title">RECEPCIÓN</span>
                <p className="pass-logistic-venue">{receptionLocation.name || invitation.venueName}</p>
                <p className="pass-logistic-address">{receptionLocation.address || visibleAddress}</p>
              </div>
            )}
            {invitation.dressCode && (
              <div className="pass-logistic-item">
                <span className="pass-logistic-title">CÓDIGO DE VESTIMENTA</span>
                <p className="pass-logistic-venue">{invitation.dressCode}</p>
              </div>
            )}
          </div>

          <div className="pass-card-footer">
            <p className="pass-instruction">
              Presenta este pase digital o impreso al ingresar al evento. ¡Gracias por acompañarnos!
            </p>
            <div className="pass-validation-barcode">
              <span className="barcode-line" />
              <span className="barcode-code">PASS-{invitation.invitationSlug || 'BODA'}-{rsvp?.accessCode || token?.slice(0, 8) || 'VIP'}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PersonalizedInvitationPage
