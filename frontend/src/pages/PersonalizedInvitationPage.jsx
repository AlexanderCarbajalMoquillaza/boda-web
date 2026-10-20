import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getInvitationBySlug, getPublicAudio, getPublicPhotos, getRsvpByToken, submitRsvp } from '../services/api'
import { FloralRomanceTemplate } from '../components/FloralRomanceTemplate'
import { EditorialCardsTemplate } from '../components/EditorialCardsTemplate'

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

  const isEditorial = invitation?.templateId === 'EDITORIAL_CARDS'

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

  return (
    <main
      className={`personalized-page ${isEditorial ? 'theme-editorial-cards' : 'theme-floral-romance'}`}
      style={{
        '--primary-color': invitation.primaryColor || '#7fb3a8',
        '--accent-color': invitation.accentColor || '#b79a62',
        '--invitation-background': invitation.backgroundColor || '#f4f1ea',
      }}
    >
      {isEditorial ? (
        <EditorialCardsTemplate {...templateProps} />
      ) : (
        <FloralRomanceTemplate {...templateProps} />
      )}
    </main>
  )
}

export default PersonalizedInvitationPage
