import { useEffect, useState } from 'react'
import { createGuestGroup, createWedding, deleteWeddingPhoto, getAdminOverview, getGuestGroups, getImageUrl, getManagedPhotos, getMyWeddings, getPublicAudio, getWeddingContent, login, updateWeddingContent, uploadWeddingAudio, uploadWeddingDressCodeImage, uploadWeddingPhoto } from '../services/api'

const photoSections = [
  ['HERO', 'Portada'],
  ['STORY', 'Historia'],
  ['GALLERY', 'Sesión preboda'],
  ['FOOTER', 'Cierre'],
]

function formatUploadDate(value) {
  return value ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(value)) : 'Fecha no disponible'
}

const emptyContent = { title: '', partnerOneName: '', partnerTwoName: '', weddingDate: '', venueName: '', venueAddress: '', locationsJson: '[]', maxRegisteredGuests: 1, welcomeMessage: '', storyText: '', dressCode: '', dressCodePreset: '', dressCodeImageUrl: '', mapUrl: '', giftRegistryUrl: '', giftOptionsJson: '[]', scheduleJson: '[]', faqJson: '[]', tablesJson: '[]', showWelcome: true, showStory: true, showSchedule: true, showDressCode: true, showLocation: true, showGiftRegistry: true, showFaq: true, showTables: true, primaryColor: '#7fb3a8', accentColor: '#b79a62', backgroundColor: '#f4f1ea' }
function parseEditorList(value) { try { const parsed = JSON.parse(value || '[]'); return Array.isArray(parsed) ? parsed : [] } catch { return [] } }

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
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('summary')
  const [newWedding, setNewWedding] = useState({ title: '', partnerOneName: '', partnerTwoName: '', weddingDate: '', venueName: '', venueAddress: '', maxRegisteredGuests: 1 })
  const [adminOverview, setAdminOverview] = useState(null)

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
    event.preventDefault()
    try {
      const saved = await updateWeddingContent(weddingId, { ...contentForm, venueName: '', venueAddress: '', mapUrl: '', maxRegisteredGuests: Number(contentForm.maxRegisteredGuests), locationsJson: JSON.stringify(locationItems), giftOptionsJson: JSON.stringify(giftItems), scheduleJson: JSON.stringify(scheduleItems), faqJson: JSON.stringify(faqItems), tablesJson: JSON.stringify(tableItems) }, token)
      setContentForm(saved)
      setScheduleItems(parseEditorList(saved.scheduleJson)); setFaqItems(parseEditorList(saved.faqJson)); setTableItems(parseEditorList(saved.tablesJson).map((table) => ({ ...table, guestIds: Array.isArray(table.guestIds) ? table.guestIds : [] })))
      setLocationItems(parseEditorList(saved.locationsJson)); setGiftItems(parseEditorList(saved.giftOptionsJson))
      setWeddings((current) => current.map((wedding) => String(wedding.id) === String(weddingId) ? { ...wedding, title: saved.title, partnerOneName: saved.partnerOneName, partnerTwoName: saved.partnerTwoName, weddingDate: saved.weddingDate, maxRegisteredGuests: saved.maxRegisteredGuests } : wedding))
      setMessage('Contenido y datos generales guardados correctamente.')
      setError('')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo guardar el contenido.')
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

  if (role === 'ADMIN') {
    return <main className="admin-page"><section className="admin-panel admin-support-panel"><p className="eyebrow">Administración global</p><h1>Centro de soporte</h1><p className="summary-section">Supervisa cuentas, bodas publicadas y enlaces para ayudar a los novios.</p><button className="secondary-button" type="button" onClick={handleLogout}>Cerrar sesión</button>{adminOverview && <><div className="summary-metrics"><article><strong>{adminOverview.userCount}</strong><span>Usuarios</span></article><article><strong>{adminOverview.weddingCount}</strong><span>Bodas</span></article><article><strong>{adminOverview.weddings.filter((wedding) => wedding.public).length}</strong><span>Invitaciones públicas</span></article></div><h2>Usuarios</h2><div className="support-list">{adminOverview.users.map((user) => <article key={user.id}><strong>{user.fullName}</strong><span>{user.email} · {user.role}</span></article>)}</div><h2>Bodas</h2><div className="support-list">{adminOverview.weddings.map((wedding) => <article key={wedding.id}><strong>{wedding.title}</strong><span>{wedding.ownerEmail} · /invitacion/{wedding.slug} · {wedding.public ? 'Pública' : 'Oculta'}</span></article>)}</div></>}</section></main>
  }

  return (
    <main className="admin-page">
      <section className="admin-panel">
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

        {activeTab === 'music' && <section className="music-panel"><h2>Música de la invitación</h2><p>La música se activará cuando el invitado pulse el botón, porque los navegadores bloquean el audio automático.</p>{currentAudio && <div className="current-audio"><span className="music-icon">♫</span><div><strong>{currentAudio.title || 'Canción de la invitación'}</strong><small>Archivo: {currentAudio.fileName || 'Nombre no disponible'}</small><small>Hay una canción cargada. Al guardar otra, se reemplazará.</small></div></div>}<form onSubmit={handleAudioUpload}><label>Archivo de audio<input type="file" accept="audio/*" onChange={(event) => setAudioFile(event.target.files[0])} required /></label><label>Título<input value={audioTitle} onChange={(event) => setAudioTitle(event.target.value)} placeholder="Nuestra canción" /></label><button className="primary-button" type="submit">{currentAudio ? 'Reemplazar canción' : 'Guardar canción'}</button></form>{message && <p className="form-success">{message}</p>}{error && <p className="form-error">{error}</p>}</section>}

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

        {activeTab === 'content' && <form className="content-form" onSubmit={handleSaveContent}>
          <h2>Contenido de la invitación</h2>
          <p className="summary-section">Organiza la información de tu invitación con campos simples. Puedes ocultar cualquier sección sin perder su contenido.</p>
          <div className="wedding-form">
            <label>Título<input value={contentForm.title || ''} onChange={(event) => setContentForm({ ...contentForm, title: event.target.value })} required /></label>
            <label>Nombre 1<input value={contentForm.partnerOneName || ''} onChange={(event) => setContentForm({ ...contentForm, partnerOneName: event.target.value })} required /></label>
            <label>Nombre 2<input value={contentForm.partnerTwoName || ''} onChange={(event) => setContentForm({ ...contentForm, partnerTwoName: event.target.value })} required /></label>
            <label>Fecha<input type="date" value={contentForm.weddingDate || ''} onChange={(event) => setContentForm({ ...contentForm, weddingDate: event.target.value })} required /></label>
            <label>Máximo de invitados<input type="number" min="1" value={contentForm.maxRegisteredGuests || 1} onChange={(event) => setContentForm({ ...contentForm, maxRegisteredGuests: Number(event.target.value) })} /></label>
          </div>
          <label>Texto de bienvenida<textarea value={contentForm.welcomeMessage || ''} onChange={(event) => setContentForm({ ...contentForm, welcomeMessage: event.target.value })} rows="3" /></label>
          <label>Historia<textarea value={contentForm.storyText || ''} onChange={(event) => setContentForm({ ...contentForm, storyText: event.target.value })} rows="5" /></label>
          <section className="content-editor-block"><h3>Código de vestimenta</h3><p className="editor-hint">Escribe la indicación que verán los invitados y usa una imagen propia o una URL de imagen. No se impondrá ninguna ilustración predeterminada.</p><label>Descripción para invitados<textarea value={contentForm.dressCode || ''} onChange={(event) => setContentForm({ ...contentForm, dressCode: event.target.value, dressCodePreset: '' })} placeholder="Ejemplo: Formal. Mujeres: vestido largo. Hombres: traje oscuro." rows="3" /></label><div className="dress-code-upload"><label>Subir imagen desde tu equipo<input type="file" accept="image/*" onChange={(event) => setDressCodeImageFile(event.target.files?.[0] || null)} /></label><button type="button" className="secondary-button upload-image-button" onClick={handleDressCodeImageUpload} disabled={uploadingDressCode}>{uploadingDressCode ? 'Cargando imagen...' : 'Cargar imagen'}</button></div><label>O usar enlace de imagen<input type="url" value={contentForm.dressCodeImageUrl || ''} onChange={(event) => setContentForm({ ...contentForm, dressCodeImageUrl: event.target.value })} placeholder="https://sitio.com/vestimenta.jpg" /></label>{contentForm.dressCodeImageUrl && <img className="dress-code-admin-preview" src={getImageUrl(contentForm.dressCodeImageUrl)} alt="Vista previa del código de vestimenta" />}</section>
          <section className="content-editor-block"><div className="repeat-heading"><div><h3>Ubicaciones del evento</h3><p className="editor-hint">Agrega ceremonia, recepción u otros momentos en lugares diferentes.</p></div><button type="button" className="secondary-button" onClick={() => setLocationItems([...locationItems, { type: 'Ceremonia', name: '', address: '', mapUrl: '' }])}>+ Añadir ubicación</button></div>{locationItems.map((item, index) => <div className="repeat-row location-row" key={`location-${index}`}><select value={item.type || ''} onChange={(event) => setLocationItems(locationItems.map((current, row) => row === index ? { ...current, type: event.target.value } : current))}><option>Ceremonia</option><option>Recepción</option><option>Celebración</option><option>Otro</option></select><input placeholder="Nombre del lugar" value={item.name || ''} onChange={(event) => setLocationItems(locationItems.map((current, row) => row === index ? { ...current, name: event.target.value } : current))} /><input placeholder="Dirección" value={item.address || ''} onChange={(event) => setLocationItems(locationItems.map((current, row) => row === index ? { ...current, address: event.target.value } : current))} /><input placeholder="URL Google Maps" value={item.mapUrl || ''} onChange={(event) => setLocationItems(locationItems.map((current, row) => row === index ? { ...current, mapUrl: event.target.value } : current))} /><button type="button" className="remove-button" onClick={() => setLocationItems(locationItems.filter((_, row) => row !== index))}>Eliminar</button></div>)}</section>
          <section className="content-editor-block"><div className="repeat-heading"><div><h3>Opciones de regalos</h3><p className="editor-hint">Puedes ofrecer transferencia, mesa de regalos, lista online o un mensaje libre.</p></div><button type="button" className="secondary-button" onClick={() => setGiftItems([...giftItems, { type: 'Mesa de regalos', title: '', details: '', url: '' }])}>+ Añadir opción</button></div>{giftItems.map((item, index) => <div className="repeat-row gift-row" key={`gift-${index}`}><select value={item.type || ''} onChange={(event) => setGiftItems(giftItems.map((current, row) => row === index ? { ...current, type: event.target.value } : current))}><option>Mesa de regalos</option><option>Transferencia</option><option>Regalo físico</option><option>Otro</option></select><input placeholder="Título" value={item.title || ''} onChange={(event) => setGiftItems(giftItems.map((current, row) => row === index ? { ...current, title: event.target.value } : current))} /><input placeholder="Datos o instrucciones" value={item.details || ''} onChange={(event) => setGiftItems(giftItems.map((current, row) => row === index ? { ...current, details: event.target.value } : current))} /><input placeholder="Enlace opcional" value={item.url || ''} onChange={(event) => setGiftItems(giftItems.map((current, row) => row === index ? { ...current, url: event.target.value } : current))} /><button type="button" className="remove-button" onClick={() => setGiftItems(giftItems.filter((_, row) => row !== index))}>Eliminar</button></div>)}</section>
          <div className="palette-editor"><h3>Paleta de la invitación</h3><label>Color principal<input type="color" value={contentForm.primaryColor || '#7fb3a8'} onChange={(event) => setContentForm({ ...contentForm, primaryColor: event.target.value })} /></label><label>Color de acento<input type="color" value={contentForm.accentColor || '#b79a62'} onChange={(event) => setContentForm({ ...contentForm, accentColor: event.target.value })} /></label><label>Color de fondo<input type="color" value={contentForm.backgroundColor || '#f4f1ea'} onChange={(event) => setContentForm({ ...contentForm, backgroundColor: event.target.value })} /></label></div>
          <div className="repeat-editor"><div className="repeat-heading"><h3>Agenda del evento</h3><button type="button" className="secondary-button" onClick={() => setScheduleItems([...scheduleItems, { time: '', title: '', notes: '' }])}>+ Añadir actividad</button></div>{scheduleItems.map((item, index) => <div className="repeat-row" key={`schedule-${index}`}><input type="time" value={item.time || ''} onChange={(event) => setScheduleItems(scheduleItems.map((current, row) => row === index ? { ...current, time: event.target.value } : current))} /><input placeholder="Actividad" value={item.title || ''} onChange={(event) => setScheduleItems(scheduleItems.map((current, row) => row === index ? { ...current, title: event.target.value } : current))} /><input placeholder="Nota o responsable" value={item.notes || ''} onChange={(event) => setScheduleItems(scheduleItems.map((current, row) => row === index ? { ...current, notes: event.target.value } : current))} /><button type="button" className="remove-button" onClick={() => setScheduleItems(scheduleItems.filter((_, row) => row !== index))}>Eliminar</button></div>)}</div>
          <div className="repeat-editor"><div className="repeat-heading"><h3>Preguntas frecuentes</h3><button type="button" className="secondary-button" onClick={() => setFaqItems([...faqItems, { question: '', answer: '' }])}>+ Añadir pregunta</button></div>{faqItems.map((item, index) => <div className="repeat-row repeat-row-faq" key={`faq-${index}`}><input placeholder="Pregunta" value={item.question || ''} onChange={(event) => setFaqItems(faqItems.map((current, row) => row === index ? { ...current, question: event.target.value } : current))} /><input placeholder="Respuesta" value={item.answer || ''} onChange={(event) => setFaqItems(faqItems.map((current, row) => row === index ? { ...current, answer: event.target.value } : current))} /><button type="button" className="remove-button" onClick={() => setFaqItems(faqItems.filter((_, row) => row !== index))}>Eliminar</button></div>)}</div>
          <div className="repeat-editor"><div className="repeat-heading"><h3>Mesas</h3><button type="button" className="secondary-button" onClick={() => setTableItems([...tableItems, { name: '', capacity: '', guestIds: [] }])}>+ Añadir mesa</button></div>{tableItems.map((item, index) => <div className="repeat-row" key={`table-${index}`}><input placeholder="Nombre de mesa" value={item.name || ''} onChange={(event) => setTableItems(tableItems.map((current, row) => row === index ? { ...current, name: event.target.value } : current))} /><input type="number" min="1" placeholder="Capacidad" value={item.capacity || ''} onChange={(event) => setTableItems(tableItems.map((current, row) => row === index ? { ...current, capacity: event.target.value } : current))} /><button type="button" className="remove-button" onClick={() => setTableItems(tableItems.filter((_, row) => row !== index))}>Eliminar</button></div>)}</div>
          <section className="seat-planner"><div className="repeat-heading"><div><h3>Asignación de invitados</h3><p className="seat-help">Arrastra a los invitados confirmados hacia una mesa o usa el selector. La distribución se guarda junto con la boda.</p></div></div><div className="seat-layout"><div className="seat-guest-list"><h4>Sin mesa</h4>{confirmedGuests.filter((guest) => !tableItems.some((table) => (table.guestIds || []).some((id) => String(id) === String(guest.id)))).map((guest) => <article className="seat-guest" draggable key={guest.id} onDragStart={(event) => event.dataTransfer.setData('guestId', String(guest.id))}><strong>{guest.fullName}</strong><small>{guest.groupName}</small><select value="" onChange={(event) => event.target.value && assignGuestToTable(guest.id, Number(event.target.value))}><option value="">Asignar mesa...</option>{tableItems.map((table, index) => <option value={index} key={index}>{table.name || `Mesa ${index + 1}`}</option>)}</select></article>)}{confirmedGuests.filter((guest) => !tableItems.some((table) => (table.guestIds || []).some((id) => String(id) === String(guest.id)))).length === 0 && <p className="seat-empty">Todos los confirmados tienen mesa.</p>}</div><div className="seat-tables">{tableItems.map((table, index) => { const seatedGuests = confirmedGuests.filter((guest) => (table.guestIds || []).some((id) => String(id) === String(guest.id))); return <article className="seat-table" key={`seat-${index}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { const guestId = event.dataTransfer.getData('guestId'); if (guestId) assignGuestToTable(guestId, index) }}><div className="seat-table-heading"><strong>{table.name || `Mesa ${index + 1}`}</strong><span>{seatedGuests.length}/{table.capacity || '∞'}</span></div>{seatedGuests.map((guest) => <div className="seated-guest" key={guest.id}><span>{guest.fullName}</span><button type="button" className="remove-button" onClick={() => removeGuestFromTables(guest.id)} aria-label={`Quitar a ${guest.fullName}`}>Quitar</button></div>)}{seatedGuests.length === 0 && <p className="seat-empty">Suelta aquí un invitado</p>}</article>})}</div></div></section>
          <div className="visibility-grid"><strong>Secciones visibles</strong>{[['showWelcome', 'Bienvenida'], ['showStory', 'Historia'], ['showSchedule', 'Agenda'], ['showDressCode', 'Vestimenta'], ['showLocation', 'Ubicación'], ['showGiftRegistry', 'Regalos'], ['showFaq', 'Preguntas frecuentes'], ['showTables', 'Mesas']].map(([field, label]) => <label className="check-label" key={field}><input type="checkbox" checked={contentForm[field] !== false} onChange={(event) => setContentForm({ ...contentForm, [field]: event.target.checked })} />{label}</label>)}</div>
          <button className="primary-button" type="submit">Guardar contenido</button>
          {message && <p className="form-success">{message}</p>}{error && <p className="form-error">{error}</p>}
        </form>}

        {activeTab === 'summary' && <section className="summary-section"><h2>Resumen</h2><p>Gestiona el contenido de <strong>{contentForm.title || weddings.find((wedding) => String(wedding.id) === String(weddingId))?.title}</strong> desde las pestañas del panel.</p><div className="summary-metrics"><article><strong>{contentForm.maxRegisteredGuests || 0}</strong><span>Pases máximos</span></article><article><strong>{groups.reduce((total, group) => total + (group.confirmedGuests || 0), 0)}</strong><span>Personas confirmadas</span></article><article><strong>{groups.reduce((total, group) => total + (group.registeredGuests || 0), 0)}</strong><span>Personas registradas</span></article><article><strong>{groups.length}</strong><span>Grupos familiares</span></article><article><strong>{photos.length}</strong><span>Fotos publicadas</span></article><article><strong>{contentForm.maxRegisteredGuests ? Math.round((groups.reduce((total, group) => total + (group.confirmedGuests || 0), 0) / contentForm.maxRegisteredGuests) * 100) : 0}%</strong><span>Personas confirmadas del máximo</span></article></div><p className="summary-note">Fecha del evento: <strong>{contentForm.weddingDate || 'Por confirmar'}</strong></p></section>}
      </section>
    </main>
  )
}

export default AdminPage
