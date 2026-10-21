import { useEffect, useState } from 'react'
import { createAdminUser, createGuestGroup, createWedding, deleteAdminUser, deleteWeddingAudio, deleteWeddingPhoto, getAdminOverview, getGuestGroups, getImageUrl, getManagedPhotos, getMyWeddings, getPublicAudio, getWeddingContent, login, updateWeddingContent, uploadWeddingAudio, uploadWeddingDressCodeImage, uploadWeddingPhoto, uploadWeddingLogo } from '../services/api'

const photoSections = [
  ['HERO', 'Portada'],
  ['STORY', 'Historia'],
  ['GALLERY', 'Sesión preboda'],
  ['FOOTER', 'Cierre'],
]

function formatUploadDate(value) {
  return value ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(value)) : 'Fecha no disponible'
}

function parseEditorList(value) {
  try {
    const parsed = JSON.parse(value || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const defaultDressCodeColors = ['#961E34', '#A98034', '#9E7D55', '#5D6D69', '#4E6532', '#8A4114', '#2C3A39']

function parseDressCodeColors(json) {
  try {
    const parsed = JSON.parse(json || '[]')
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch {
    // fallback
  }
  return defaultDressCodeColors
}

const emptyContent = { title: '', partnerOneName: '', partnerTwoName: '', weddingDate: '', venueName: '', venueAddress: '', locationsJson: '[]', maxRegisteredGuests: 1, welcomeMessage: '', welcomeCitation: '', brideFatherName: '', brideMotherName: '', groomFatherName: '', groomMotherName: '', godfatherName: '', godmotherName: '', customLogoUrl: '', storyText: '', dressCode: '', dressCodePreset: '', dressCodeImageUrl: '', showDressCodePalette: false, dressCodeColorsJson: '[]', mapUrl: '', giftRegistryUrl: '', giftOptionsJson: '[]', scheduleJson: '[]', faqJson: '[]', tablesJson: '[]', showWelcome: true, showStory: true, showSchedule: true, showDressCode: true, showLocation: true, showGiftRegistry: true, showFaq: true, showTables: true, primaryColor: '#7fb3a8', accentColor: '#b79a62', backgroundColor: '#f4f1ea', templateId: 'FLORAL_ROMANCE' }
function hexToRgb(hex) {
  if (!hex) return { r: 0, g: 0, b: 0, text: '0, 0, 0' }
  let clean = String(hex).replace('#', '').trim()
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('')
  }
  const num = parseInt(clean, 16)
  if (isNaN(num) || clean.length !== 6) return { r: 0, g: 0, b: 0, text: '0, 0, 0' }
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return { r, g, b, text: `${r}, ${g}, ${b}` }
}

function rgbToHex(r, g, b) {
  const clamp = (val) => Math.max(0, Math.min(255, Number(val) || 0))
  return `#${((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1).toUpperCase()}`
}

function ColorFieldControl({ label, badge, purpose, value, onChange }) {
  const [copiedType, setCopiedType] = useState('')
  const hexValue = (value || '#7FB3A8').toUpperCase()
  const rgb = hexToRgb(hexValue)

  function handleHexChange(e) {
    let val = e.target.value.trim()
    if (!val.startsWith('#') && val.length > 0) {
      val = `#${val}`
    }
    onChange(val)
  }

  function handleRgbSubmit(val) {
    const trimmed = (val || '').trim()
    // Soporta "122, 28, 46", "122 28 46", "rgb(122, 28, 46)"
    const match = trimmed.match(/^(?:rgb\()?[\s]*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})[\s)]*$/i)
    if (match) {
      const hex = rgbToHex(match[1], match[2], match[3])
      onChange(hex)
    }
  }

  function handleCopy(textToCopy, type) {
    if (!textToCopy) return
    navigator.clipboard?.writeText(textToCopy)
    setCopiedType(type)
    setTimeout(() => setCopiedType(''), 2200)
  }

  const isValidHex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hexValue)

  return (
    <div className="color-field-card">
      <div className="color-field-header">
        <div className="color-field-title-row">
          <strong className="color-field-name">{label}</strong>
          {badge && <span className="color-field-badge">{badge}</span>}
        </div>
        <p className="color-field-purpose">{purpose}</p>
      </div>

      <div className="color-field-interactive">
        <label className="color-swatch-picker-label" title="Haz clic para abrir el selector visual de color">
          <input
            type="color"
            value={isValidHex && hexValue.length === 7 ? hexValue : '#7FB3A8'}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="color-hidden-native-input"
          />
          <span
            className="color-swatch-circle"
            style={{ backgroundColor: isValidHex ? hexValue : '#7FB3A8' }}
          />
          <span className="swatch-hint">Cambiar</span>
        </label>

        <div className="color-inputs-stack">
          <div className="color-input-group">
            <span className="color-input-prefix">HEX</span>
            <input
              type="text"
              value={hexValue}
              onChange={handleHexChange}
              placeholder="#RRGGBB"
              maxLength={7}
            />
          </div>

          <div className="color-input-group">
            <span className="color-input-prefix">RGB</span>
            <input
              type="text"
              defaultValue={rgb.text}
              key={hexValue}
              onBlur={(e) => handleRgbSubmit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleRgbSubmit(e.target.value)
                }
              }}
              placeholder="R, G, B"
              title="Presiona Enter o cambia de campo para aplicar"
            />
          </div>
        </div>
      </div>

      <div className="color-copy-actions">
        <button
          type="button"
          className={`color-copy-btn ${copiedType === 'hex' ? 'is-copied' : ''}`}
          onClick={() => handleCopy(hexValue, 'hex')}
          title="Copiar código HEX"
        >
          {copiedType === 'hex' ? '✓ HEX Copiado' : '📋 Copiar HEX'}
        </button>
        <button
          type="button"
          className={`color-copy-btn ${copiedType === 'rgb' ? 'is-copied' : ''}`}
          onClick={() => handleCopy(`rgb(${rgb.text})`, 'rgb')}
          title="Copiar formato RGB"
        >
          {copiedType === 'rgb' ? '✓ RGB Copiado' : '📋 Copiar RGB'}
        </button>
      </div>
    </div>
  )
}

function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken') || '')
  const [userId, setUserId] = useState(() => sessionStorage.getItem('adminUserId') || '')
  const [role, setRole] = useState(() => sessionStorage.getItem('adminRole') || '')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [weddings, setWeddings] = useState([])
  const [weddingId, setWeddingId] = useState('')
  const [file, setFile] = useState(null)
  const [audioFile, setAudioFile] = useState(null)
  const [audioTitle, setAudioTitle] = useState('')
  const [dressCodeImageFile, setDressCodeImageFile] = useState(null)
  const [uploadingDressCode, setUploadingDressCode] = useState(false)
  const [customLogoFile, setCustomLogoFile] = useState(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [caption, setCaption] = useState('')
  const [section, setSection] = useState('GALLERY')
  const [photos, setPhotos] = useState([])
  const [groups, setGroups] = useState([])
  const [groupForm, setGroupForm] = useState({ contactName: '', maxGuestsAllowed: 1 })
  const [contentForm, setContentForm] = useState(emptyContent)
  const [scheduleItems, setScheduleItems] = useState([])
  const [faqItems, setFaqItems] = useState([])
  const [tableItems, setTableItems] = useState([])
  const [locationItems, setLocationItems] = useState([])
  const [giftItems, setGiftItems] = useState([])
  const [currentAudio, setCurrentAudio] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sessionExpired, setSessionExpired] = useState(false)
  const [reauthPassword, setReauthPassword] = useState('')
  const [reauthing, setReauthing] = useState(false)
  const [savingContent, setSavingContent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('summary')
  const [newWedding, setNewWedding] = useState({ title: '', partnerOneName: '', partnerTwoName: '', weddingDate: '', venueName: '', venueAddress: '', maxRegisteredGuests: 1 })
  const [adminOverview, setAdminOverview] = useState(null)
  const [viewMode, setViewMode] = useState('admin')
  const [newCouple, setNewCouple] = useState({ fullName: '', email: '', password: '' })
  const [creatingCouple, setCreatingCouple] = useState(false)
  const [adminSuccess, setAdminSuccess] = useState('')
  const [adminError, setAdminError] = useState('')

  useEffect(() => {
    if (token && role === 'ADMIN') getAdminOverview(token).then(setAdminOverview).catch(() => setError('No se pudo cargar el resumen administrativo.'))
  }, [token, role])

  useEffect(() => {
    if (!token || !userId) return
    getMyWeddings(userId, token)
      .then((items) => {
        setWeddings(items)
        if (items.length > 0) setWeddingId(String(items[0].id))
      })
      .catch(() => setError('No se pudieron cargar tus bodas.'))
  }, [token, userId])

  useEffect(() => {
    if (!token || !weddingId) return
    getManagedPhotos(weddingId, token).then(setPhotos).catch(() => setError('No se pudieron cargar las fotos de esta boda.'))
    getGuestGroups(weddingId, token).then(setGroups).catch(() => setError('No se pudieron cargar los grupos familiares.'))
    getWeddingContent(weddingId, token).then((data) => { setContentForm(data); setScheduleItems(parseEditorList(data.scheduleJson)); setFaqItems(parseEditorList(data.faqJson)); setTableItems(parseEditorList(data.tablesJson).map((table) => ({ ...table, guestIds: Array.isArray(table.guestIds) ? table.guestIds : [] }))); const savedLocations = parseEditorList(data.locationsJson); setLocationItems(savedLocations.length > 0 ? savedLocations : (data.venueName || data.venueAddress ? [{ type: 'Celebración', name: data.venueName || '', address: data.venueAddress || '', mapUrl: data.mapUrl || '' }] : [])); setGiftItems(parseEditorList(data.giftOptionsJson)) }).catch(() => setError('No se pudo cargar el contenido de la boda.'))
    const selectedWedding = weddings.find((wedding) => String(wedding.id) === String(weddingId))
    if (selectedWedding?.invitationSlug) getPublicAudio(selectedWedding.invitationSlug).then(setCurrentAudio).catch(() => setCurrentAudio(null))
  }, [token, weddingId])

  async function handleLogin(event) {
    event.preventDefault()
    setError('')
    try {
      const response = await login({ email, password })
      sessionStorage.setItem('adminToken', response.token)
      sessionStorage.setItem('adminUserId', response.userId)
      sessionStorage.setItem('adminRole', response.role || 'COUPLE')
      sessionStorage.setItem('adminEmail', response.email || email)
      setToken(response.token)
      setUserId(String(response.userId))
      setRole(response.role || 'COUPLE')
      setMessage('Sesión iniciada correctamente.')
    } catch {
      setError('Correo o contraseña incorrectos.')
    }
  }

  async function handleUpload(event) {
    event.preventDefault()
    if (!file) {
      setError('Selecciona una imagen antes de subirla.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const photo = await uploadWeddingPhoto(weddingId, file, caption, section, token)
      setPhotos((current) => [...current, photo])
      setFile(null)
      setCaption('')
      setSection('GALLERY')
      event.target.reset()
      setMessage('Foto subida correctamente.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || `No se pudo subir la imagen (${requestError.response?.status || 'sin respuesta'}).`)
    } finally {
      setLoading(false)
    }
  }

  async function handleAudioUpload(event) {
    event.preventDefault()
    if (!audioFile) { setError('Selecciona una canción.'); return }
    try {
      const savedAudio = await uploadWeddingAudio(weddingId, audioFile, audioTitle, token)
      setCurrentAudio(savedAudio)
      setMessage('Canción guardada correctamente.')
      setAudioFile(null)
      setAudioTitle('')
      event.target.reset()
    } catch (requestError) {
      if (requestError.code === 'NO_ADMIN_SESSION') {
        setError('La sesión expiró. Inicia sesión nuevamente antes de guardar la canción.')
      } else {
        setError(requestError.response?.data?.message || 'No se pudo subir la canción.')
      }
    }
  }

  async function handleDeleteAudio() {
    if (!window.confirm('¿Deseas eliminar la música de fondo de tu invitación?')) return
    try {
      setLoading(true)
      await deleteWeddingAudio(weddingId, token)
      setCurrentAudio(null)
      setMessage('Canción eliminada correctamente.')
      setError('')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo eliminar la canción.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDressCodeImageUpload() {
    if (!dressCodeImageFile) {
      setError('Selecciona una imagen del código de vestimenta.')
      return
    }
    setUploadingDressCode(true)
    setError('')
    try {
      const savedImage = await uploadWeddingDressCodeImage(weddingId, dressCodeImageFile, token)
      setContentForm((current) => ({ ...current, dressCodeImageUrl: savedImage.imageUrl }))
      setDressCodeImageFile(null)
      setMessage('Imagen del código de vestimenta cargada. Guarda el contenido para publicarla.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo cargar la imagen del código de vestimenta.')
    } finally {
      setUploadingDressCode(false)
    }
  }

  async function handleCustomLogoUpload() {
    if (!customLogoFile) {
      setError('Selecciona una imagen para el logo personalizado.')
      return
    }
    setUploadingLogo(true)
    setError('')
    try {
      const savedLogo = await uploadWeddingLogo(weddingId, customLogoFile, token)
      setContentForm((current) => ({ ...current, customLogoUrl: savedLogo.imageUrl }))
      setCustomLogoFile(null)
      setMessage('Logo personalizado subido correctamente. Guarda el contenido para publicarlo.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo cargar el logo personalizado.')
    } finally {
      setUploadingLogo(false)
    }
  }

  useEffect(() => {
    if (!message && !error) return undefined
    const timer = window.setTimeout(() => { setMessage(''); setError('') }, 4000)
    return () => window.clearTimeout(timer)
  }, [message, error])

  function handleLogout() {
    sessionStorage.removeItem('adminToken')
    sessionStorage.removeItem('adminUserId')
    sessionStorage.removeItem('adminRole')
    setToken('')
    setUserId('')
    setWeddings([])
    setPhotos([])
    setAdminOverview(null)
  }

  async function handleCreateWedding(event) {
    event.preventDefault()
    try {
      const wedding = await createWedding({ ...newWedding, ownerUserId: Number(userId) }, token)
      setWeddings((current) => [...current, wedding])
      setWeddingId(String(wedding.id))
      setNewWedding({ title: '', partnerOneName: '', partnerTwoName: '', weddingDate: '', venueName: '', venueAddress: '', maxRegisteredGuests: 1 })
      setActiveTab('summary')
      setMessage('Boda creada correctamente.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo crear la boda.')
    }
  }

  async function handleCreateCouple(event) {
    event.preventDefault()
    setAdminError('')
    setAdminSuccess('')
    setCreatingCouple(true)
    try {
      await createAdminUser({ ...newCouple, role: 'COUPLE' }, token)
      setAdminSuccess(`¡Cuenta creada con éxito para "${newCouple.fullName}"! Ya pueden iniciar sesión con ${newCouple.email}.`)
      setNewCouple({ fullName: '', email: '', password: '' })
      const overview = await getAdminOverview(token)
      setAdminOverview(overview)
    } catch (err) {
      setAdminError(err.response?.data?.message || 'Error al crear la cuenta de novios.')
    } finally {
      setCreatingCouple(false)
    }
  }

  async function handleDeleteCouple(id, name) {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la cuenta de "${name}"?`)) return
    setAdminError('')
    setAdminSuccess('')
    try {
      await deleteAdminUser(id, token)
      setAdminSuccess('Usuario eliminado correctamente.')
      const overview = await getAdminOverview(token)
      setAdminOverview(overview)
    } catch (err) {
      setAdminError(err.response?.data?.message || 'Error al eliminar usuario.')
    }
  }

  async function handleDeletePhoto(photoId) {
    if (!window.confirm('¿Eliminar esta foto de la galería?')) return
    try {
      await deleteWeddingPhoto(weddingId, photoId, token)
      setPhotos((current) => current.filter((photo) => photo.id !== photoId))
    } catch {
      setError('No se pudo eliminar la foto.')
    }
  }

  async function handleCreateGroup(event) {
    event.preventDefault()
    try {
      const group = await createGuestGroup(weddingId, groupForm, token)
      setGroups((current) => [...current, group])
      setGroupForm({ contactName: '', maxGuestsAllowed: 1 })
      setMessage('Grupo familiar creado correctamente.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo crear el grupo familiar.')
    }
  }

  async function handleSaveContent(event) {
    if (event) event.preventDefault()
    if (!contentForm.title?.trim()) {
      setError('Por favor ingresa un título para la boda.')
      return
    }
    if (!contentForm.partnerOneName?.trim() || !contentForm.partnerTwoName?.trim()) {
      setError('Por favor ingresa los nombres de ambos novios.')
      return
    }
    if (!contentForm.weddingDate) {
      setError('Por favor selecciona la fecha de la boda.')
      return
    }
    setSavingContent(true)
    setError('')
    setMessage('')
    try {
      const saved = await updateWeddingContent(weddingId, { ...contentForm, venueName: '', venueAddress: '', mapUrl: '', maxRegisteredGuests: Number(contentForm.maxRegisteredGuests || 1), locationsJson: JSON.stringify(locationItems), giftOptionsJson: JSON.stringify(giftItems), scheduleJson: JSON.stringify(scheduleItems), faqJson: JSON.stringify(faqItems), tablesJson: JSON.stringify(tableItems) }, token)
      setContentForm(saved)
      setScheduleItems(parseEditorList(saved.scheduleJson)); setFaqItems(parseEditorList(saved.faqJson)); setTableItems(parseEditorList(saved.tablesJson).map((table) => ({ ...table, guestIds: Array.isArray(table.guestIds) ? table.guestIds : [] })))
      setLocationItems(parseEditorList(saved.locationsJson)); setGiftItems(parseEditorList(saved.giftOptionsJson))
      setWeddings((current) => current.map((wedding) => String(wedding.id) === String(weddingId) ? { ...wedding, title: saved.title, partnerOneName: saved.partnerOneName, partnerTwoName: saved.partnerTwoName, weddingDate: saved.weddingDate, maxRegisteredGuests: saved.maxRegisteredGuests } : wedding))
      setMessage('Contenido y datos generales guardados correctamente.')
      setError('')
      setSessionExpired(false)
    } catch (requestError) {
      console.error('Error al guardar contenido:', requestError)
      if (requestError.response?.status === 401) {
        setSessionExpired(true)
        setError('Tu sesión ha expirado por inactividad o reinicio del servidor. Ingresa tu contraseña abajo para renovarla y guardar tus cambios.')
      } else {
        setError(requestError.response?.data?.message || requestError.message || 'No se pudo guardar el contenido.')
      }
    } finally {
      setSavingContent(false)
    }
  }

  async function handleReauthAndSave(e) {
    if (e) e.preventDefault()
    if (!reauthPassword) {
      setError('Por favor ingresa tu contraseña.')
      return
    }
    setReauthing(true)
    setError('')
    try {
      const emailToUse = email || sessionStorage.getItem('adminEmail') || weddings.find((w) => String(w.id) === String(weddingId))?.ownerEmail || 'alexander@yopmail.com'
      const response = await login({ email: emailToUse, password: reauthPassword })
      sessionStorage.setItem('adminToken', response.token)
      sessionStorage.setItem('adminUserId', response.userId)
      sessionStorage.setItem('adminRole', response.role || 'COUPLE')
      sessionStorage.setItem('adminEmail', response.email || emailToUse)
      setToken(response.token)
      setSessionExpired(false)
      setReauthPassword('')

      const saved = await updateWeddingContent(weddingId, {
        ...contentForm,
        venueName: '',
        venueAddress: '',
        mapUrl: '',
        maxRegisteredGuests: Number(contentForm.maxRegisteredGuests),
        locationsJson: JSON.stringify(locationItems),
        giftOptionsJson: JSON.stringify(giftItems),
        scheduleJson: JSON.stringify(scheduleItems),
        faqJson: JSON.stringify(faqItems),
        tablesJson: JSON.stringify(tableItems)
      }, response.token)
      setContentForm(saved)
      setScheduleItems(parseEditorList(saved.scheduleJson))
      setFaqItems(parseEditorList(saved.faqJson))
      setTableItems(parseEditorList(saved.tablesJson).map((table) => ({ ...table, guestIds: Array.isArray(table.guestIds) ? table.guestIds : [] })))
      setLocationItems(parseEditorList(saved.locationsJson))
      setGiftItems(parseEditorList(saved.giftOptionsJson))
      setWeddings((current) => current.map((wedding) => String(wedding.id) === String(weddingId) ? { ...wedding, title: saved.title, partnerOneName: saved.partnerOneName, partnerTwoName: saved.partnerTwoName, weddingDate: saved.weddingDate, maxRegisteredGuests: saved.maxRegisteredGuests } : wedding))
      setMessage('¡Sesión renovada y contenido guardado correctamente!')
      setError('')
    } catch (err) {
      console.error('Error al renovar sesión:', err)
      setError('Contraseña incorrecta. Por favor inténtalo de nuevo o cierra sesión.')
    } finally {
      setReauthing(false)
    }
  }

  const confirmedGuests = groups.flatMap((group) => (group.guests || [])
    .filter((guest) => guest.attendanceStatus === 'CONFIRMED')
    .map((guest) => ({ ...guest, groupName: group.contactName })))

  function assignGuestToTable(guestId, tableIndex) {
    const normalizedId = String(guestId)
    setTableItems((current) => {
      const target = current[tableIndex]
      if (!target) return current
      const targetGuests = Array.isArray(target.guestIds) ? target.guestIds : []
      const alreadyAssigned = targetGuests.some((id) => String(id) === normalizedId)
      const capacity = Number(target.capacity)
      if (!alreadyAssigned && capacity > 0 && targetGuests.length >= capacity) {
        setError(`${target.name || `Mesa ${tableIndex + 1}`} ya alcanzó su capacidad.`)
        return current
      }
      return current.map((table, index) => ({
        ...table,
        guestIds: index === tableIndex
          ? [...new Set([...((table.guestIds || []).map(String)), normalizedId])]
          : (table.guestIds || []).filter((id) => String(id) !== normalizedId),
      }))
    })
  }

  function removeGuestFromTables(guestId) {
    const normalizedId = String(guestId)
    setTableItems((current) => current.map((table) => ({ ...table, guestIds: (table.guestIds || []).filter((id) => String(id) !== normalizedId) })))
  }

  function handleToggleDressCodePalette(enabled) {
    const currentList = parseDressCodeColors(contentForm.dressCodeColorsJson)
    setContentForm({
      ...contentForm,
      showDressCodePalette: enabled,
      dressCodeColorsJson: JSON.stringify(currentList),
    })
  }

  function handleAddDressCodeColor(newHex) {
    const current = parseDressCodeColors(contentForm.dressCodeColorsJson)
    if (!current.includes(newHex)) {
      setContentForm({
        ...contentForm,
        dressCodeColorsJson: JSON.stringify([...current, newHex]),
      })
    }
  }

  function handleUpdateDressCodeColor(index, newHex) {
    const current = [...parseDressCodeColors(contentForm.dressCodeColorsJson)]
    current[index] = newHex
    setContentForm({
      ...contentForm,
      dressCodeColorsJson: JSON.stringify(current),
    })
  }

  function handleRemoveDressCodeColor(index) {
    const current = parseDressCodeColors(contentForm.dressCodeColorsJson)
    setContentForm({
      ...contentForm,
      dressCodeColorsJson: JSON.stringify(current.filter((_, i) => i !== index)),
    })
  }

  function handleResetDressCodeColors() {
    setContentForm({
      ...contentForm,
      dressCodeColorsJson: JSON.stringify(defaultDressCodeColors),
    })
  }

  if (!token) {
    return (
      <main className="admin-page">
        <form className="admin-panel admin-login" onSubmit={handleLogin}>
          <p className="eyebrow">Panel de los novios</p>
          <h1>Iniciar sesión</h1>
          <label>Correo<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button" type="submit">Ingresar</button>
        </form>
      </main>
    )
  }

  if (role === 'ADMIN' && viewMode === 'admin') {
    return (
      <main className="admin-page">
        <section className="admin-panel admin-support-panel">
          <p className="eyebrow">Administración global</p>
          <h1>Centro de soporte y parejas</h1>
          <p className="summary-section">
            Supervisa cuentas, registra los accesos para las parejas de novios y gestiona bodas.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: '20px 0 28px' }}>
            <button className="primary-button" type="button" onClick={() => setViewMode('couple')}>
              Ir a Gestionar Bodas (Panel de Novios) →
            </button>
            <button className="secondary-button" type="button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>

          {adminSuccess && (
            <p className="form-success" style={{ padding: '14px', background: '#eaf4ee', border: '1px solid #7fb3a8', color: '#2d6053', margin: '16px 0', borderRadius: '4px' }}>
              {adminSuccess}
            </p>
          )}
          {adminError && <p className="form-error" style={{ margin: '16px 0' }}>{adminError}</p>}

          {adminOverview && (
            <>
              <div className="summary-metrics">
                <article>
                  <strong>{adminOverview.userCount}</strong>
                  <span>Usuarios totales</span>
                </article>
                <article>
                  <strong>{adminOverview.weddingCount}</strong>
                  <span>Bodas registradas</span>
                </article>
                <article>
                  <strong>{adminOverview.weddings.filter((wedding) => wedding.public).length}</strong>
                  <span>Invitaciones públicas</span>
                </article>
              </div>

              {/* Formulario para registrar novios */}
              <div style={{ margin: '32px 0', padding: '24px', background: '#f4f1ea', border: '1px solid #d9e2df' }}>
                <h2 style={{ margin: '0 0 6px', fontSize: '1.4rem' }}>+ Crear cuenta para pareja de novios</h2>
                <p style={{ margin: '0 0 16px', color: '#68736f', fontSize: '0.85rem', lineHeight: '1.4' }}>
                  Ingresa los datos de los novios. Con este correo y contraseña ellos podrán ingresar en este mismo enlace para gestionar su boda (invitados, fotos, itinerario y mesas).
                </p>
                <form onSubmit={handleCreateCouple} style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <label style={{ margin: 0 }}>
                      Nombres de la pareja
                      <input
                        type="text"
                        placeholder="Ej: Carlos y María"
                        value={newCouple.fullName}
                        onChange={(e) => setNewCouple({ ...newCouple, fullName: e.target.value })}
                        required
                      />
                    </label>
                    <label style={{ margin: 0 }}>
                      Correo electrónico de acceso
                      <input
                        type="email"
                        placeholder="carlosymaria@gmail.com"
                        value={newCouple.email}
                        onChange={(e) => setNewCouple({ ...newCouple, email: e.target.value })}
                        required
                      />
                    </label>
                    <label style={{ margin: 0 }}>
                      Contraseña inicial
                      <input
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={newCouple.password}
                        onChange={(e) => setNewCouple({ ...newCouple, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </label>
                  </div>
                  <div>
                    <button className="primary-button" type="submit" disabled={creatingCouple} style={{ marginTop: '8px' }}>
                      {creatingCouple ? 'Creando cuenta...' : '+ Registrar pareja de novios'}
                    </button>
                  </div>
                </form>
              </div>

              <h2>Usuarios registrados ({adminOverview.users.length})</h2>
              <div className="support-list">
                {adminOverview.users.map((user) => (
                  <article key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <strong style={{ fontSize: '1.05rem', display: 'block' }}>{user.fullName}</strong>
                      <span style={{ display: 'inline-block', marginTop: '4px' }}>
                        {user.email} ·{' '}
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          background: user.role === 'ADMIN' ? '#d0e5e0' : '#ece4d4',
                          color: user.role === 'ADMIN' ? '#275249' : '#695126',
                        }}>
                          {user.role === 'ADMIN' ? 'ADMINISTRADOR' : 'NOVIOS'}
                        </span>
                      </span>
                    </div>
                    {user.role !== 'ADMIN' && (
                      <button
                        className="remove-button"
                        type="button"
                        onClick={() => handleDeleteCouple(user.id, user.fullName)}
                        style={{ alignSelf: 'center' }}
                      >
                        Eliminar cuenta
                      </button>
                    )}
                  </article>
                ))}
              </div>

              <h2>Bodas registradas ({adminOverview.weddings.length})</h2>
              <div className="support-list">
                {adminOverview.weddings.length === 0 ? (
                  <p style={{ color: '#68736f', padding: '12px' }}>Aún no hay bodas creadas en el sistema.</p>
                ) : (
                  adminOverview.weddings.map((wedding) => (
                    <article key={wedding.id}>
                      <strong>{wedding.title}</strong>
                      <span>
                        Dueño: {wedding.ownerEmail} ·{' '}
                        <a href={`/invitacion/${wedding.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#628f85', textDecoration: 'underline' }}>
                          Ver invitación pública (/invitacion/{wedding.slug})
                        </a>
                        {' '}· {wedding.public ? 'Pública' : 'Oculta'}
                      </span>
                    </article>
                  ))
                )}
              </div>
            </>
          )}
        </section>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <section className="admin-panel">
        {role === 'ADMIN' && (
          <button
            className="secondary-button"
            type="button"
            onClick={() => setViewMode('admin')}
            style={{ marginBottom: '18px', display: 'inline-block' }}
          >
            ← Volver a Centro de Administración
          </button>
        )}
        <p className="eyebrow">Panel de los novios</p>
        <h1>Gestionar invitación</h1>
        <button className="secondary-button" type="button" onClick={handleLogout}>Cerrar sesión</button>
        <label>
          Boda
          <select value={weddingId} onChange={(event) => setWeddingId(event.target.value)} required>
            {weddings.map((wedding) => (
              <option value={wedding.id} key={wedding.id}>
                {wedding.title} · {wedding.weddingDate}
              </option>
            ))}
          </select>
        </label>
        {weddings.length === 0 && <p className="form-error">No tienes bodas registradas para gestionar.</p>}
        <div className="weddings-toolbar">
          <span>Mis bodas</span>
          <button className="secondary-button" type="button" onClick={() => setActiveTab('new')}>+ Nueva boda</button>
        </div>
        <nav className="admin-tabs" aria-label="Secciones del panel">
          <button className={activeTab === 'summary' ? 'active' : ''} type="button" onClick={() => setActiveTab('summary')}>Resumen</button>
          <button className={activeTab === 'photos' ? 'active' : ''} type="button" onClick={() => setActiveTab('photos')}>Galería</button>
          <button className={activeTab === 'music' ? 'active' : ''} type="button" onClick={() => setActiveTab('music')}>Música</button>
          <button className={activeTab === 'groups' ? 'active' : ''} type="button" onClick={() => setActiveTab('groups')}>Grupos familiares</button>
          <button className={activeTab === 'content' ? 'active' : ''} type="button" onClick={() => setActiveTab('content')}>Contenido</button>
        </nav>

        {activeTab === 'new' && <form className="wedding-form" onSubmit={handleCreateWedding}>
          <h2>Nueva boda</h2>
          <label>Título<input value={newWedding.title} onChange={(event) => setNewWedding({ ...newWedding, title: event.target.value })} required /></label>
          <label>Nombre 1<input value={newWedding.partnerOneName} onChange={(event) => setNewWedding({ ...newWedding, partnerOneName: event.target.value })} required /></label>
          <label>Nombre 2<input value={newWedding.partnerTwoName} onChange={(event) => setNewWedding({ ...newWedding, partnerTwoName: event.target.value })} required /></label>
          <label>Fecha<input type="date" value={newWedding.weddingDate} onChange={(event) => setNewWedding({ ...newWedding, weddingDate: event.target.value })} required /></label>
          <label>Máximo de invitados<input type="number" min="1" value={newWedding.maxRegisteredGuests} onChange={(event) => setNewWedding({ ...newWedding, maxRegisteredGuests: Number(event.target.value) })} required /></label>
          <button className="primary-button" type="submit">Crear boda</button>
        </form>}

        {activeTab === 'photos' && <><h2>Galería de fotos</h2>
        <form className="upload-form" onSubmit={handleUpload}>
          <label>Selecciona una imagen<input type="file" accept="image/*" onChange={(event) => setFile(event.target.files[0])} required /></label>
          <label>Descripción<input value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Opcional" /></label>
          <label>Ubicación en la invitación<select value={section} onChange={(event) => setSection(event.target.value)}>
            <option value="HERO">Portada</option>
            <option value="STORY">Historia</option>
            <option value="GALLERY">Galería preboda</option>
            <option value="FOOTER">Cierre</option>
          </select></label>
          <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Subiendo...' : 'Subir foto'}</button>
        </form>
        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}
        {photoSections.map(([section, label]) => <section className="photo-section" key={section}>
          <div className="photo-section-heading"><h3>{label}</h3><span>{photos.filter((photo) => photo.section === section).length} fotos</span></div>
          <div className="admin-gallery">
            {photos.filter((photo) => photo.section === section).map((photo) => <article className="photo-management-card" key={photo.id}>
              <img src={getImageUrl(photo.imageUrl)} alt={photo.caption || 'Foto de boda'} />
              <p>{photo.caption || 'Sin descripción'}</p>
              <small>Cargada: {formatUploadDate(photo.createdAt)}</small>
              <button className="remove-button" type="button" onClick={() => handleDeletePhoto(photo.id)}>Eliminar foto</button>
            </article>)}
          </div>
        </section>)}</>}

        {activeTab === 'music' && (
          <section className="music-panel">
            <h2>Música de fondo de la invitación</h2>
            <p className="editor-hint">
              La música de fondo empezará a sonar cuando el invitado abra la carta o pulse el botón musical en pantalla.
            </p>

            {currentAudio ? (
              <div className="current-audio-card">
                <div className="current-audio-header">
                  <span className="music-active-badge">♫ Canción Activa</span>
                  <button
                    type="button"
                    className="delete-audio-btn"
                    onClick={handleDeleteAudio}
                    disabled={loading}
                    title="Eliminar música actual"
                  >
                    🗑️ Eliminar música
                  </button>
                </div>
                <div className="current-audio-body">
                  <h4 className="audio-card-title">{currentAudio.title || 'Canción de la invitación'}</h4>
                  <p className="audio-card-filename">Archivo: {currentAudio.fileName || 'audio.mp3'}</p>
                  <audio
                    controls
                    src={getImageUrl(currentAudio.audioUrl)}
                    className="admin-preview-audio-player"
                    preload="metadata"
                  />
                </div>
                <p className="audio-change-tip">
                  Si deseas cambiar la canción, selecciona un nuevo archivo a continuación:
                </p>
              </div>
            ) : (
              <div className="no-audio-state-card">
                <span className="no-audio-icon" aria-hidden="true">🎵</span>
                <h4>Sin música de fondo configurada</h4>
                <p>Sube una canción en formato .mp3, .m4a o .wav para ambientar la experiencia de tus invitados.</p>
              </div>
            )}

            <form onSubmit={handleAudioUpload} className="admin-audio-form">
              <label>
                {currentAudio ? 'Seleccionar nueva canción para reemplazar (.mp3, .m4a, .wav)' : 'Archivo de audio (.mp3, .m4a, .wav)'}
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(event) => setAudioFile(event.target.files[0])}
                  required
                />
              </label>
              <label>
                Título de la canción
                <input
                  value={audioTitle}
                  onChange={(event) => setAudioTitle(event.target.value)}
                  placeholder="Ej: A Thousand Years - Christina Perri"
                />
              </label>
              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? 'Subiendo audio...' : currentAudio ? 'Reemplazar y guardar canción' : 'Guardar y subir canción'}
              </button>
            </form>
            {message && <p className="form-success">{message}</p>}
            {error && <p className="form-error">{error}</p>}
          </section>
        )}

        {activeTab === 'groups' && <section><h2>Grupos familiares</h2>
        <form className="group-form" onSubmit={handleCreateGroup}>
          <label>Nombre del grupo<input value={groupForm.contactName} onChange={(event) => setGroupForm({ ...groupForm, contactName: event.target.value })} required placeholder="Familia Silva" /></label>
          <label>Pases disponibles<input type="number" min="1" value={groupForm.maxGuestsAllowed} onChange={(event) => setGroupForm({ ...groupForm, maxGuestsAllowed: Number(event.target.value) })} required /></label>
          <button className="primary-button" type="submit">Crear grupo familiar</button>
        </form>
        <div className="group-list">
          {groups.map((group) => <article className="group-card" key={group.id}>
            <strong>{group.contactName}</strong>
            <span>{group.confirmedGuests} confirmados de {group.maxGuestsAllowed} pases · {group.registeredGuests} registrados · {group.status}</span>
            <small>Enlace personalizado: /invitacion/{weddings.find((wedding) => String(wedding.id) === String(weddingId))?.invitationSlug}/rsvp/{group.accessToken}</small>
            {group.guests?.length > 0 && <details><summary>Ver invitados</summary>{group.guests.map((guest) => <div className="guest-row" key={guest.id}><span>{guest.fullName}</span><small>{guest.attendanceStatus === 'CONFIRMED' ? 'Asiste' : 'No asiste'}</small></div>)}</details>}
          </article>)}
        </div></section>}

        {activeTab === 'content' && <form className="content-form" onSubmit={handleSaveContent} noValidate>
          <h2>Contenido de la invitación</h2>
          <p className="summary-section">Organiza la información de tu invitación con campos simples. Puedes ocultar cualquier sección sin perder su contenido.</p>
          {message && <p className="form-success" style={{ padding: '12px 16px', background: '#eaf5ea', color: '#1b6329', borderRadius: '8px', fontWeight: 600, margin: '10px 0' }}>{message}</p>}
          {error && <p className="form-error" style={{ padding: '12px 16px', background: '#fdeeed', color: '#b91c1c', borderRadius: '8px', fontWeight: 600, margin: '10px 0' }}>{error}</p>}
          <div className="wedding-form">
            <label>Título<input value={contentForm.title || ''} onChange={(event) => setContentForm({ ...contentForm, title: event.target.value })} required /></label>
            <label>Nombre 1<input value={contentForm.partnerOneName || ''} onChange={(event) => setContentForm({ ...contentForm, partnerOneName: event.target.value })} required /></label>
            <label>Nombre 2<input value={contentForm.partnerTwoName || ''} onChange={(event) => setContentForm({ ...contentForm, partnerTwoName: event.target.value })} required /></label>
            <label>Fecha<input type="date" value={contentForm.weddingDate || ''} onChange={(event) => setContentForm({ ...contentForm, weddingDate: event.target.value })} required /></label>
            <label>Máximo de invitados<input type="number" min="1" value={contentForm.maxRegisteredGuests || 1} onChange={(event) => setContentForm({ ...contentForm, maxRegisteredGuests: Number(event.target.value) })} /></label>
          </div>
          <div className="content-editor-block">
            <h3>Mensaje de Bienvenida y Cita Bíblica / Frase</h3>
            <p className="editor-hint">Escribe una dedicatoria o pasaje bíblico para tus invitados. Si colocas la cita o libro (ej: Colosenses 3:14 o 1 Corintios 13:4-8), se resaltará automáticamente con el color de acento de tu boda.</p>
            <label>Texto de bienvenida o pasaje bíblico
              <textarea
                value={contentForm.welcomeMessage || ''}
                onChange={(event) => setContentForm({ ...contentForm, welcomeMessage: event.target.value })}
                rows="3"
                placeholder="Por encima de todo, vístanse de amor, que es el vínculo perfecto."
              />
            </label>
            <label>Cita bíblica o referencia (opcional)
              <input
                value={contentForm.welcomeCitation || ''}
                onChange={(event) => setContentForm({ ...contentForm, welcomeCitation: event.target.value })}
                placeholder="Ejemplo: Colosenses 3:14"
              />
            </label>
          </div>

          <div className="content-editor-block">
            <h3>Logo o Monograma de los Novios</h3>
            <p className="editor-hint">Si tienen su propio logotipo, monograma o isotipo personalizado de boda, pueden subirlo aquí. Si no suben ninguna imagen, la invitación mostrará las elegantes iniciales de los novios por defecto.</p>
            <div className="dress-code-upload">
              <label>Subir logo propio (PNG transparente recomendado)
                <input type="file" accept="image/*" onChange={(event) => setCustomLogoFile(event.target.files?.[0] || null)} />
              </label>
              <button
                type="button"
                className="secondary-button upload-image-button"
                onClick={handleCustomLogoUpload}
                disabled={uploadingLogo}
              >
                {uploadingLogo ? 'Cargando logo...' : 'Cargar logo'}
              </button>
            </div>
            {contentForm.customLogoUrl && (
              <div className="custom-logo-admin-preview-wrap" style={{ marginTop: '12px' }}>
                <img
                  className="custom-logo-admin-preview"
                  src={getImageUrl(contentForm.customLogoUrl)}
                  alt="Logo de los novios"
                  style={{ maxHeight: '90px', objectFit: 'contain', background: '#faf8f5', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                <button
                  type="button"
                  className="remove-button"
                  style={{ display: 'block', marginTop: '8px' }}
                  onClick={() => setContentForm({ ...contentForm, customLogoUrl: '' })}
                >
                  Restablecer a iniciales por defecto
                </button>
              </div>
            )}
          </div>

          <div className="content-editor-block">
            <h3>Padres y Padrinos de Boda (Opcional)</h3>
            <p className="editor-hint">Los nombres de los padres y padrinos se mostrarán con la bendición de la familia en las plantillas. Ningún campo es obligatorio.</p>
            <div className="wedding-form family-inputs-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              <div className="family-col-block">
                <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', color: 'var(--text-color)' }}>Novia</h4>
                <label>Mamá de la novia
                  <input
                    value={contentForm.brideMotherName || ''}
                    onChange={(e) => setContentForm({ ...contentForm, brideMotherName: e.target.value })}
                    placeholder="Nombre de la mamá"
                  />
                </label>
                <label>Papá de la novia
                  <input
                    value={contentForm.brideFatherName || ''}
                    onChange={(e) => setContentForm({ ...contentForm, brideFatherName: e.target.value })}
                    placeholder="Nombre del papá"
                  />
                </label>
              </div>

              <div className="family-col-block">
                <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', color: 'var(--text-color)' }}>Novio</h4>
                <label>Mamá del novio
                  <input
                    value={contentForm.groomMotherName || ''}
                    onChange={(e) => setContentForm({ ...contentForm, groomMotherName: e.target.value })}
                    placeholder="Nombre de la mamá"
                  />
                </label>
                <label>Papá del novio
                  <input
                    value={contentForm.groomFatherName || ''}
                    onChange={(e) => setContentForm({ ...contentForm, groomFatherName: e.target.value })}
                    placeholder="Nombre del papá"
                  />
                </label>
              </div>

              <div className="family-col-block">
                <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', color: 'var(--text-color)' }}>Padrinos</h4>
                <label>Madrina de boda
                  <input
                    value={contentForm.godmotherName || ''}
                    onChange={(e) => setContentForm({ ...contentForm, godmotherName: e.target.value })}
                    placeholder="Nombre de la madrina"
                  />
                </label>
                <label>Padrino de boda
                  <input
                    value={contentForm.godfatherName || ''}
                    onChange={(e) => setContentForm({ ...contentForm, godfatherName: e.target.value })}
                    placeholder="Nombre del padrino"
                  />
                </label>
              </div>
            </div>
          </div>
          <label>Historia<textarea value={contentForm.storyText || ''} onChange={(event) => setContentForm({ ...contentForm, storyText: event.target.value })} rows="5" /></label>
          <section className="content-editor-block">
            <h3>Código de vestimenta</h3>
            <p className="editor-hint">Escribe la indicación que verán los invitados y usa una imagen propia o una URL de imagen. No se impondrá ninguna ilustración predeterminada.</p>
            <label>Descripción para invitados<textarea value={contentForm.dressCode || ''} onChange={(event) => setContentForm({ ...contentForm, dressCode: event.target.value, dressCodePreset: '' })} placeholder="Ejemplo: Formal. Mujeres: vestido largo. Hombres: traje oscuro." rows="3" /></label>
            <div className="dress-code-upload">
              <label>Subir imagen desde tu equipo<input type="file" accept="image/*" onChange={(event) => setDressCodeImageFile(event.target.files?.[0] || null)} /></label>
              <button type="button" className="secondary-button upload-image-button" onClick={handleDressCodeImageUpload} disabled={uploadingDressCode}>{uploadingDressCode ? 'Cargando imagen...' : 'Cargar imagen'}</button>
            </div>
            <label>O usar enlace de imagen<input type="url" value={contentForm.dressCodeImageUrl || ''} onChange={(event) => setContentForm({ ...contentForm, dressCodeImageUrl: event.target.value })} placeholder="https://sitio.com/vestimenta.jpg" /></label>
            {contentForm.dressCodeImageUrl && <img className="dress-code-admin-preview" src={getImageUrl(contentForm.dressCodeImageUrl)} alt="Vista previa del código de vestimenta" />}

            {/* Administrador de la paleta de colores de vestimenta para invitados */}
            <div className="dresscode-palette-manager">
              <label className="dresscode-palette-toggle">
                <input
                  type="checkbox"
                  checked={Boolean(contentForm.showDressCodePalette)}
                  onChange={(e) => handleToggleDressCodePalette(e.target.checked)}
                />
                <span><strong>Habilitar paleta de colores sugerida en código de vestimenta</strong></span>
              </label>
              <p className="editor-hint" style={{ marginTop: '6px', marginBottom: contentForm.showDressCodePalette ? '12px' : '0' }}>
                Si activas esta opción, los invitados podrán ver los círculos con los tonos sugeridos para su atuendo en la invitación.
              </p>

              {contentForm.showDressCodePalette && (
                <div className="dresscode-palette-content">
                  <div className="dresscode-swatches-grid">
                    {parseDressCodeColors(contentForm.dressCodeColorsJson).map((hex, index) => (
                      <div className="dresscode-swatch-item" key={`swatch-${index}-${hex}`}>
                        <label title="Haz clic para cambiar este color" style={{ cursor: 'pointer' }}>
                          <input
                            type="color"
                            value={hex}
                            onChange={(e) => handleUpdateDressCodeColor(index, e.target.value.toUpperCase())}
                            className="color-hidden-native-input"
                          />
                          <span className="dresscode-swatch-circle" style={{ backgroundColor: hex }} />
                        </label>
                        <span className="dresscode-swatch-hex">{hex}</span>
                        <button
                          type="button"
                          className="dresscode-swatch-remove"
                          onClick={() => handleRemoveDressCodeColor(index)}
                          title="Eliminar este color"
                          aria-label={`Eliminar color ${hex}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="dresscode-add-color-row">
                    <label className="dresscode-color-picker-input">
                      <input
                        type="color"
                        defaultValue="#7A1C2E"
                        onChange={(e) => handleAddDressCodeColor(e.target.value.toUpperCase())}
                        className="color-hidden-native-input"
                      />
                      <span>+ Añadir nuevo color</span>
                    </label>
                    <button
                      type="button"
                      className="dresscode-reset-btn"
                      onClick={handleResetDressCodeColors}
                    >
                      ↺ Restablecer colores sugeridos por defecto
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
          <section className="content-editor-block"><div className="repeat-heading"><div><h3>Ubicaciones del evento</h3><p className="editor-hint">Agrega ceremonia, recepción u otros momentos en lugares diferentes.</p></div><button type="button" className="secondary-button" onClick={() => setLocationItems([...locationItems, { type: 'Ceremonia', name: '', address: '', mapUrl: '' }])}>+ Añadir ubicación</button></div>{locationItems.map((item, index) => <div className="repeat-row location-row" key={`location-${index}`}><select value={item.type || ''} onChange={(event) => setLocationItems(locationItems.map((current, row) => row === index ? { ...current, type: event.target.value } : current))}><option>Ceremonia</option><option>Recepción</option><option>Celebración</option><option>Otro</option></select><input placeholder="Nombre del lugar" value={item.name || ''} onChange={(event) => setLocationItems(locationItems.map((current, row) => row === index ? { ...current, name: event.target.value } : current))} /><input placeholder="Dirección" value={item.address || ''} onChange={(event) => setLocationItems(locationItems.map((current, row) => row === index ? { ...current, address: event.target.value } : current))} /><input placeholder="URL Google Maps" value={item.mapUrl || ''} onChange={(event) => setLocationItems(locationItems.map((current, row) => row === index ? { ...current, mapUrl: event.target.value } : current))} /><button type="button" className="remove-button" onClick={() => setLocationItems(locationItems.filter((_, row) => row !== index))}>Eliminar</button></div>)}</section>
          <section className="content-editor-block"><div className="repeat-heading"><div><h3>Opciones de regalos</h3><p className="editor-hint">Puedes ofrecer transferencia, mesa de regalos, lista online o un mensaje libre.</p></div><button type="button" className="secondary-button" onClick={() => setGiftItems([...giftItems, { type: 'Mesa de regalos', title: '', details: '', url: '' }])}>+ Añadir opción</button></div>{giftItems.map((item, index) => <div className="repeat-row gift-row" key={`gift-${index}`}><select value={item.type || ''} onChange={(event) => setGiftItems(giftItems.map((current, row) => row === index ? { ...current, type: event.target.value } : current))}><option>Mesa de regalos</option><option>Transferencia</option><option>Regalo físico</option><option>Otro</option></select><input placeholder="Título" value={item.title || ''} onChange={(event) => setGiftItems(giftItems.map((current, row) => row === index ? { ...current, title: event.target.value } : current))} /><input placeholder="Datos o instrucciones" value={item.details || ''} onChange={(event) => setGiftItems(giftItems.map((current, row) => row === index ? { ...current, details: event.target.value } : current))} /><input placeholder="Enlace opcional" value={item.url || ''} onChange={(event) => setGiftItems(giftItems.map((current, row) => row === index ? { ...current, url: event.target.value } : current))} /><button type="button" className="remove-button" onClick={() => setGiftItems(giftItems.filter((_, row) => row !== index))}>Eliminar</button></div>)}</section>
          <div className="template-selector-block">
            <div className="repeat-heading">
              <div>
                <h3>Plantilla de diseño de la invitación</h3>
                <p className="editor-hint">Escoge el estilo visual que verán tus invitados. Las cuatro plantillas adaptan armónicamente los colores que elijas abajo.</p>
              </div>
            </div>
            <div className="templates-selector-grid four-templates-grid">
              {/* Plantilla 1: Romántica Floral */}
              <button
                type="button"
                className={`template-choice-card ${contentForm.templateId === 'FLORAL_ROMANCE' ? 'is-active' : ''}`}
                onClick={() => setContentForm({ ...contentForm, templateId: 'FLORAL_ROMANCE' })}
              >
                <div className="template-badge-tag">Plantilla 1</div>
                <h4>Romántica Floral</h4>
                <p>Sobre interactivo con rosas botánicas, monograma caligráfico y presentación tradicional refinada.</p>
                <div className="template-sample-preview floral-sample">
                  <span>✉ Sobre Clásico</span>
                </div>
              </button>

              {/* Plantilla 2: Editorial Romance & Arcos */}
              <button
                type="button"
                className={`template-choice-card ${contentForm.templateId === 'EDITORIAL_CARDS' ? 'is-active' : ''}`}
                onClick={() => setContentForm({ ...contentForm, templateId: 'EDITORIAL_CARDS' })}
              >
                <div className="template-badge-tag highlight-badge">Plantilla 2</div>
                <h4>Editorial Romance &amp; Arcos</h4>
                <p>Portada con botón minimalista, tipografía de revista, tarjetas flotantes con cortes de arco e iconografía fina.</p>
                <div className="template-sample-preview cards-sample">
                  <span>♥ Cards &amp; Arcos</span>
                </div>
              </button>

              {/* Plantilla 3: Romance Editorial Floral */}
              <button
                type="button"
                className={`template-choice-card ${contentForm.templateId === 'EDITORIAL_FLORAL_COMBO' ? 'is-active' : ''}`}
                onClick={() => setContentForm({ ...contentForm, templateId: 'EDITORIAL_FLORAL_COMBO' })}
              >
                <div className="template-badge-tag combo-badge">Plantilla 3</div>
                <h4>Romance Editorial Floral</h4>
                <p>Portada con sobre interactivo y esquinas florales de arcos, nombres ampliados, y tarjetas editoriales con arcos.</p>
                <div className="template-sample-preview combo-sample">
                  <span>✉ Sobre + Arcos</span>
                </div>
              </button>

              {/* Plantilla 4: Boho Rústico & Terracota */}
              <button
                type="button"
                className={`template-choice-card ${contentForm.templateId === 'BOHO_CHIC_MINIMAL' ? 'is-active' : ''}`}
                onClick={() => setContentForm({ ...contentForm, templateId: 'BOHO_CHIC_MINIMAL' })}
              >
                <div className="template-badge-tag boho-badge">Plantilla 4</div>
                <h4>Boho Rústico &amp; Terracota</h4>
                <p>Estética cálida y rústica, fotos con bordes rasgados de papel, timeline de actividades, versículo bíblico y sobre floral.</p>
                <div className="template-sample-preview boho-sample">
                  <span>🌾 Boho &amp; Timeline</span>
                </div>
              </button>
            </div>
          </div>

          <div className="palette-editor">
            <div className="palette-heading-row">
              <div className="palette-heading-text">
                <h3>Paleta de la invitación</h3>
                <p>Personaliza los tonos principales. Estos colores se aplican dinámicamente a la plantilla seleccionada.</p>
              </div>
              <div className="quick-palette-pills">
                <span className="quick-palette-label">Sugerencias:</span>
                <button
                  type="button"
                  className="quick-palette-btn"
                  onClick={() => setContentForm({ ...contentForm, primaryColor: '#7A1C2E', accentColor: '#B79A62', backgroundColor: '#F9F4F0' })}
                >
                  <span className="dot" style={{ background: '#7A1C2E' }} /> Borgoña & Oro
                </button>
                <button
                  type="button"
                  className="quick-palette-btn"
                  onClick={() => setContentForm({ ...contentForm, primaryColor: '#7FB3A8', accentColor: '#B79A62', backgroundColor: '#F4F1EA' })}
                >
                  <span className="dot" style={{ background: '#7FB3A8' }} /> Salvia Clásico
                </button>
                <button
                  type="button"
                  className="quick-palette-btn"
                  onClick={() => setContentForm({ ...contentForm, primaryColor: '#2C3E50', accentColor: '#D4AF37', backgroundColor: '#F8F9FA' })}
                >
                  <span className="dot" style={{ background: '#2C3E50' }} /> Azul Noche & Oro
                </button>
                <button
                  type="button"
                  className="quick-palette-btn"
                  onClick={() => setContentForm({ ...contentForm, primaryColor: '#B85D36', accentColor: '#9E7D55', backgroundColor: '#FAF6F0' })}
                >
                  <span className="dot" style={{ background: '#B85D36' }} /> Terracota Boho
                </button>
              </div>
            </div>
            <div className="palette-controls-grid">
              <ColorFieldControl
                label="Color principal"
                badge="Botones y Énfasis"
                purpose="Botones principales ('Ver Invitación', 'Confirmar asistencia'), tarjeta destacada de regalos y elementos de énfasis"
                value={contentForm.primaryColor || '#7FB3A8'}
                onChange={(val) => setContentForm({ ...contentForm, primaryColor: val })}
              />
              <ColorFieldControl
                label="Color de acento"
                badge="Caligrafía e Iconos"
                purpose="Nombres de los novios en caligrafía artística, corazones entrelazados, títulos de sección y detalles decorativos"
                value={contentForm.accentColor || '#B79A62'}
                onChange={(val) => setContentForm({ ...contentForm, accentColor: val })}
              />
              <ColorFieldControl
                label="Color de fondo"
                badge="Lienzo y Portada"
                purpose="Fondo de la pantalla de inicio (con velo sobre las rosas en acuarela), pliegos y lienzos de la invitación"
                value={contentForm.backgroundColor || '#F4F1EA'}
                onChange={(val) => setContentForm({ ...contentForm, backgroundColor: val })}
              />
            </div>
          </div>
          <div className="repeat-editor"><div className="repeat-heading"><h3>Agenda de actividades</h3><button type="button" className="secondary-button" onClick={() => setScheduleItems([...scheduleItems, { time: '', title: '', notes: '' }])}>+ Añadir actividad</button></div>{scheduleItems.map((item, index) => <div className="repeat-row" key={`schedule-${index}`}><input type="time" value={item.time || ''} onChange={(event) => setScheduleItems(scheduleItems.map((current, row) => row === index ? { ...current, time: event.target.value } : current))} /><input placeholder="Actividad" value={item.title || ''} onChange={(event) => setScheduleItems(scheduleItems.map((current, row) => row === index ? { ...current, title: event.target.value } : current))} /><input placeholder="Nota o responsable" value={item.notes || ''} onChange={(event) => setScheduleItems(scheduleItems.map((current, row) => row === index ? { ...current, notes: event.target.value } : current))} /><button type="button" className="remove-button" onClick={() => setScheduleItems(scheduleItems.filter((_, row) => row !== index))}>Eliminar</button></div>)}</div>
          <div className="repeat-editor"><div className="repeat-heading"><h3>Preguntas frecuentes</h3><button type="button" className="secondary-button" onClick={() => setFaqItems([...faqItems, { question: '', answer: '' }])}>+ Añadir pregunta</button></div>{faqItems.map((item, index) => <div className="repeat-row repeat-row-faq" key={`faq-${index}`}><input placeholder="Pregunta" value={item.question || ''} onChange={(event) => setFaqItems(faqItems.map((current, row) => row === index ? { ...current, question: event.target.value } : current))} /><input placeholder="Respuesta" value={item.answer || ''} onChange={(event) => setFaqItems(faqItems.map((current, row) => row === index ? { ...current, answer: event.target.value } : current))} /><button type="button" className="remove-button" onClick={() => setFaqItems(faqItems.filter((_, row) => row !== index))}>Eliminar</button></div>)}</div>
          <div className="repeat-editor"><div className="repeat-heading"><h3>Mesas</h3><button type="button" className="secondary-button" onClick={() => setTableItems([...tableItems, { name: '', capacity: '', guestIds: [] }])}>+ Añadir mesa</button></div>{tableItems.map((item, index) => <div className="repeat-row" key={`table-${index}`}><input placeholder="Nombre de mesa" value={item.name || ''} onChange={(event) => setTableItems(tableItems.map((current, row) => row === index ? { ...current, name: event.target.value } : current))} /><input type="number" min="1" placeholder="Capacidad" value={item.capacity || ''} onChange={(event) => setTableItems(tableItems.map((current, row) => row === index ? { ...current, capacity: event.target.value } : current))} /><button type="button" className="remove-button" onClick={() => setTableItems(tableItems.filter((_, row) => row !== index))}>Eliminar</button></div>)}</div>
          <section className="seat-planner"><div className="repeat-heading"><div><h3>Asignación de invitados</h3><p className="seat-help">Arrastra a los invitados confirmados hacia una mesa o usa el selector. La distribución se guarda junto con la boda.</p></div></div><div className="seat-layout"><div className="seat-guest-list"><h4>Sin mesa</h4>{confirmedGuests.filter((guest) => !tableItems.some((table) => (table.guestIds || []).some((id) => String(id) === String(guest.id)))).map((guest) => <article className="seat-guest" draggable key={guest.id} onDragStart={(event) => event.dataTransfer.setData('guestId', String(guest.id))}><strong>{guest.fullName}</strong><small>{guest.groupName}</small><select value="" onChange={(event) => event.target.value && assignGuestToTable(guest.id, Number(event.target.value))}><option value="">Asignar mesa...</option>{tableItems.map((table, index) => <option value={index} key={index}>{table.name || `Mesa ${index + 1}`}</option>)}</select></article>)}{confirmedGuests.filter((guest) => !tableItems.some((table) => (table.guestIds || []).some((id) => String(id) === String(guest.id)))).length === 0 && <p className="seat-empty">Todos los confirmados tienen mesa.</p>}</div><div className="seat-tables">{tableItems.map((table, index) => { const seatedGuests = confirmedGuests.filter((guest) => (table.guestIds || []).some((id) => String(id) === String(guest.id))); return <article className="seat-table" key={`seat-${index}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { const guestId = event.dataTransfer.getData('guestId'); if (guestId) assignGuestToTable(guestId, index) }}><div className="seat-table-heading"><strong>{table.name || `Mesa ${index + 1}`}</strong><span>{seatedGuests.length}/{table.capacity || '∞'}</span></div>{seatedGuests.map((guest) => <div className="seated-guest" key={guest.id}><span>{guest.fullName}</span><button type="button" className="remove-button" onClick={() => removeGuestFromTables(guest.id)} aria-label={`Quitar a ${guest.fullName}`}>Quitar</button></div>)}{seatedGuests.length === 0 && <p className="seat-empty">Suelta aquí un invitado</p>}</article>})}</div></div></section>
          <div className="visibility-grid"><strong>Secciones visibles</strong>{[['showWelcome', 'Bienvenida'], ['showStory', 'Historia'], ['showSchedule', 'Agenda'], ['showDressCode', 'Vestimenta'], ['showLocation', 'Ubicación'], ['showGiftRegistry', 'Regalos'], ['showFaq', 'Preguntas frecuentes'], ['showTables', 'Mesas']].map(([field, label]) => <label className="check-label" key={field}><input type="checkbox" checked={contentForm[field] !== false} onChange={(event) => setContentForm({ ...contentForm, [field]: event.target.checked })} />{label}</label>)}</div>
          <button className="primary-button" id="save-content-btn" type="submit" onClick={handleSaveContent} disabled={savingContent}>
            {savingContent ? 'Guardando contenido...' : 'Guardar contenido'}
          </button>
          {message && <p className="form-success">{message}</p>}
          {error && (
            <div className="form-error-block" style={{ marginTop: '12px' }}>
              <p className="form-error">{error}</p>
              {sessionExpired && (
                <div className="reauth-modal-inline" style={{ marginTop: '12px', padding: '16px 20px', background: '#faf6f0', border: '1.5px solid var(--accent-color, #c17a56)', borderRadius: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
                  <h4 style={{ margin: '0 0 6px', color: '#2c2523', fontSize: '1rem', fontWeight: 600 }}>Renovar sesión para guardar</h4>
                  <p style={{ margin: '0 0 12px', fontSize: '0.88rem', color: '#6d6159' }}>
                    Tu sesión expiró. Ingresa tu contraseña para continuar sin perder ningún cambio que hayas realizado:
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      value={reauthPassword}
                      onChange={(e) => setReauthPassword(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleReauthAndSave(e) } }}
                      style={{ flex: 1, minWidth: '200px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                    <button
                      type="button"
                      className="primary-button"
                      onClick={handleReauthAndSave}
                      disabled={reauthing}
                    >
                      {reauthing ? 'Renovando...' : 'Renovar y Guardar'}
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>}

        {activeTab === 'summary' && <section className="summary-section"><h2>Resumen</h2><p>Gestiona el contenido de <strong>{contentForm.title || weddings.find((wedding) => String(wedding.id) === String(weddingId))?.title}</strong> desde las pestañas del panel.</p><div className="summary-metrics"><article><strong>{contentForm.maxRegisteredGuests || 0}</strong><span>Pases máximos</span></article><article><strong>{groups.reduce((total, group) => total + (group.confirmedGuests || 0), 0)}</strong><span>Personas confirmadas</span></article><article><strong>{groups.reduce((total, group) => total + (group.registeredGuests || 0), 0)}</strong><span>Personas registradas</span></article><article><strong>{groups.length}</strong><span>Grupos familiares</span></article><article><strong>{photos.length}</strong><span>Fotos publicadas</span></article><article><strong>{contentForm.maxRegisteredGuests ? Math.round((groups.reduce((total, group) => total + (group.confirmedGuests || 0), 0) / contentForm.maxRegisteredGuests) * 100) : 0}%</strong><span>Personas confirmadas del máximo</span></article></div><p className="summary-note">Fecha del evento: <strong>{contentForm.weddingDate || 'Por confirmar'}</strong></p></section>}
      </section>
    </main>
  )
}

export default AdminPage
