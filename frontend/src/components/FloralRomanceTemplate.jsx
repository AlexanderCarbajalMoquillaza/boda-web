import React from 'react'
import { getImageUrl } from '../services/api'

const coverReferenceImage = '/illustrations/cover-envelope-reference.png'
const coverFloralBouquet = '/illustrations/cover-floral-bouquet.jpg'
const coverFloralVertical = '/illustrations/cover-floral-vertical.png'
const coverFloralRosesCluster = '/illustrations/cover-floral-vertical.png'

export function FloralRomanceTemplate({
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
}) {
  return (
    <div className="floral-romance-template">
      {!isOpened && (
        <div className={`invitation-cover ${isOpening ? 'is-opening' : ''}`}>
          <img className="cover-floral-image cover-floral-bouquet" src={coverFloralBouquet} alt="" aria-hidden="true" />
          <img className="cover-floral-image cover-floral-vertical" src={coverFloralVertical} alt="" aria-hidden="true" />
          <img className="cover-floral-image cover-floral-roses-cluster" src={coverFloralRosesCluster} alt="" aria-hidden="true" />
          <div className="invitation-cover-content">
            <p className="eyebrow">Nuestra boda</p>
            <h1 className="cover-couple">
              <span className="cover-name">{invitation.partnerOneName}</span>
              <span className="cover-ampersand">&amp;</span>
              <span className="cover-name">{invitation.partnerTwoName}</span>
            </h1>
            <p className="cover-date">{formatDate(invitation.weddingDate)}</p>
            <button className="envelope-visual" type="button" onClick={openInvitation} disabled={isOpening} aria-label="Abrir invitación">
              <span className="envelope-image-wrap">
                <img className="envelope-reference-image" src={coverReferenceImage} alt="Sobre de la invitación con flores" />
                <span className="envelope-initials" aria-hidden="true">{envelopeMonogram}</span>
              </span>
              <span className="envelope-open-label">{isOpening ? 'Abriendo...' : 'Dar click para abrir'}</span>
            </button>
            {rsvp && (
              <>
                <p className="cover-family">{rsvp.contactName}</p>
                <p className="cover-reservation">
                  Hemos reservado <strong>{rsvp.maxGuestsAllowed}</strong> pase{rsvp.maxGuestsAllowed === 1 ? '' : 's'} para ti
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <section className="invitation-hero personalized-hero">
        {audio && (
          <div className="music-control">
            <audio id="wedding-audio" src={getImageUrl(audio.audioUrl)} loop />
            <button
              type="button"
              className={musicOn ? 'is-playing' : ''}
              onClick={toggleMusic}
              aria-label={musicOn ? 'Pausar música' : 'Reproducir música'}
            >
              <span className="music-icon" aria-hidden="true">{musicOn ? '❚❚' : '♫'}</span>
              <span>{musicOn ? 'Pausar música' : 'Escuchar música'}</span>
            </button>
          </div>
        )}
        {rsvp && <p className="eyebrow">Invitación para {rsvp.contactName}</p>}
        <h1>{invitation.partnerOneName} <span>&amp;</span> {invitation.partnerTwoName}</h1>
        <p className="invitation-title">{invitation.title}</p>
        <p className="wedding-date">{formatDate(invitation.weddingDate)}</p>
        <div className="countdown" aria-label="Cuenta regresiva para la boda">
          <div><strong>{countdown.days}</strong><span>Días</span></div>
          <div><strong>{String(countdown.hours).padStart(2, '0')}</strong><span>Horas</span></div>
          <div><strong>{String(countdown.minutes).padStart(2, '0')}</strong><span>Min</span></div>
          <div><strong>{String(countdown.seconds).padStart(2, '0')}</strong><span>Seg</span></div>
        </div>
        <div className="hero-divider" aria-hidden="true">✦</div>
        {invitation.showWelcome !== false && (
          <p className="welcome-text">{invitation.welcomeMessage || 'Nos encantará celebrar este día contigo.'}</p>
        )}
        {heroPhotos.length > 0 && (
          <div className="hero-gallery">
            <img className="hero-photo" src={getImageUrl(heroPhotos[heroIndex % heroPhotos.length].imageUrl)} alt={heroPhotos[heroIndex % heroPhotos.length].caption || 'Foto de los novios'} />
            {heroPhotos.length > 1 && (
              <div className="hero-dots" aria-label="Fotos de portada">
                {heroPhotos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    className={index === heroIndex % heroPhotos.length ? 'active' : ''}
                    onClick={() => setHeroIndex(index)}
                    aria-label={`Mostrar foto ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {invitation.showLocation !== false && (
        <section className="details-section">
          <p className="eyebrow">Celebración</p>
          {locations.length > 0 ? (
            <div className="location-list">
              {locations.map((location, index) => (
                <article className="location-card" key={`${location.type}-${index}`}>
                  <p className="eyebrow">{location.type || 'Evento'}</p>
                  <h2>{location.name || 'Lugar por confirmar'}</h2>
                  <p className="muted-text">{location.address || 'Dirección por confirmar'}</p>
                  {(location.mapUrl || location.address) && (
                    <button
                      className="secondary-button location-button"
                      type="button"
                      onClick={() => openMap(location.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address || location.name || '')}`)}
                    >
                      Ver ubicación en Google Maps
                    </button>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <>
              <h2>{invitation.venueName || 'Lugar por confirmar'}</h2>
              <p className="muted-text">{visibleAddress || 'Dirección por confirmar'}</p>
              {mapQuery && (
                <div className="map-card">
                  <button className="secondary-button location-button" type="button" onClick={() => openMap(mapExternalUrl)}>
                    Ver ubicación en Google Maps
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {invitation.showStory !== false && (storyPhotos.length > 0 || invitation.storyText) && (
        <section className="story-section">
          <div>
            <p className="eyebrow">Nuestra historia</p>
            <h2>Un momento para recordar</h2>
            <p>{invitation.storyText || storyPhotos[0]?.caption || 'Gracias por acompañarnos en este capítulo tan especial.'}</p>
          </div>
          {storyPhotos.length > 0 && (
            <div className="story-photo-grid">
              {storyPhotos.map((photo) => (
                <img key={photo.id} src={getImageUrl(photo.imageUrl)} alt={photo.caption || 'Historia de los novios'} />
              ))}
            </div>
          )}
        </section>
      )}

      {invitation.showSchedule !== false && schedule.length > 0 && (
        <section className="content-section">
          <p className="eyebrow">Agenda</p>
          <h2>El día de nuestra boda</h2>
          <div className="schedule-list">
            {schedule.map((item, index) => (
              <article key={`${item.title}-${index}`}>
                <strong>{item.time || item.startsAt || ''}</strong>
                <div>
                  <h3>{item.title}</h3>
                  {item.notes && <p>{item.notes}</p>}
                  {item.responsible && <small>{item.responsible}</small>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {invitation.showDressCode !== false && (invitation.dressCode || invitation.dressCodeImageUrl) && (
        <section className="content-section dress-code-section">
          <p className="eyebrow">Vestimenta</p>
          <h2>Código de vestimenta</h2>
          {invitation.dressCodeImageUrl && (
            <img className="dress-code-image" src={getImageUrl(invitation.dressCodeImageUrl)} alt="Referencia del código de vestimenta" />
          )}
          <p className="dress-code-label">{invitation.dressCode || 'Código de vestimenta'}</p>
          {invitation.showDressCodePalette && (
            <div className="dress-code-palette-block" style={{ marginTop: '16px' }}>
              <p className="palette-label" style={{ fontSize: '0.78rem', letterSpacing: '0.12em', color: '#666', marginBottom: '8px' }}>PALETA DE COLORES SUGERIDA</p>
              <div className="palette-swatches-row" style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {(() => {
                  try {
                    const parsed = JSON.parse(invitation.dressCodeColorsJson || '[]')
                    if (Array.isArray(parsed) && parsed.length > 0) return parsed
                  } catch {
                    // fallback
                  }
                  return [
                    invitation.accentColor || '#7A1C2E',
                    invitation.primaryColor || '#A98034',
                    '#9E7D55',
                    '#5D6D69',
                    '#4E6532',
                    '#8A4114',
                    '#2C3A39',
                  ]
                })().map((color, i) => (
                  <span
                    key={i}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: '2px solid #fff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      display: 'inline-block'
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {invitation.showGiftRegistry !== false && (giftOptions.length > 0 || invitation.giftRegistryUrl) && (
        <section className="content-section gift-section">
          <p className="eyebrow">Regalos</p>
          <h2>Un detalle para nosotros</h2>
          {giftOptions.length > 0 ? (
            <div className="gift-list">
              {giftOptions.map((item, index) => (
                <article key={`${item.title}-${index}`}>
                  <p className="eyebrow">{item.type || 'Opción'}</p>
                  <h3>{item.title || item.type}</h3>
                  <p>{item.details}</p>
                  {item.url && <a className="primary-button" href={item.url} target="_blank" rel="noreferrer">Ver opción</a>}
                </article>
              ))}
            </div>
          ) : (
            <a className="primary-button" href={invitation.giftRegistryUrl} target="_blank" rel="noreferrer">Ver mesa de regalos</a>
          )}
        </section>
      )}

      {invitation.showFaq !== false && faqs.length > 0 && (
        <section className="content-section faq-section">
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2>Todo lo que necesitas saber</h2>
          {faqs.map((item, index) => (
            <details key={`${item.question}-${index}`}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </section>
      )}

      {invitation.showTables !== false && tables.length > 0 && (
        <section className="content-section">
          <p className="eyebrow">Recepción</p>
          <h2>Mesas</h2>
          <div className="table-list">
            {tables.map((item, index) => (
              <article key={`${item.name}-${index}`}>
                <strong>{item.name || `Mesa ${index + 1}`}</strong>
                <span>{item.guests || item.capacity || ''}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      {photos.length > 0 && (
        <section className="gallery-section">
          <p className="eyebrow">Nuestros recuerdos</p>
          <h2>Sesión preboda</h2>
          <div className="gallery-grid">
            {photos.filter((photo) => photo.section === 'GALLERY').map((photo) => (
              <figure key={photo.id} className="gallery-item">
                <img src={getImageUrl(photo.imageUrl)} alt={photo.caption || 'Foto de la sesión preboda'} />
                {photo.caption && <figcaption>{photo.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      {rsvp && (
        <section className="rsvp-section">
          <p className="eyebrow">Confirmación</p>
          <h2>¿Quiénes nos acompañarán?</h2>
          <p className="rsvp-limit">
            Tienes {rsvp.maxGuestsAllowed} pase{rsvp.maxGuestsAllowed === 1 ? '' : 's'} reservado{rsvp.maxGuestsAllowed === 1 ? '' : 's'}.
          </p>

          <form className="rsvp-form" onSubmit={handleSubmit}>
            <label className="attendees-selector">
              ¿Cuántas personas asistirán?
              <select value={attendeesCount} onChange={(event) => changeAttendeesCount(event.target.value)} required>
                <option value="" disabled>Selecciona una cantidad</option>
                {Array.from({ length: rsvp.maxGuestsAllowed }, (_, index) => index + 1).map((amount) => (
                  <option value={amount} key={amount}>{amount} {amount === 1 ? 'persona' : 'personas'}</option>
                ))}
              </select>
            </label>

            {guests.length > 0 && <p className="form-hint">Ahora registra los nombres de quienes asistirán.</p>}
            {guests.map((guest, index) => (
              <fieldset className="guest-card" key={`${guest.id || 'new'}-${index}`}>
                <legend>Invitado {index + 1}</legend>
                <label>
                  Nombre completo
                  <input value={guest.fullName} onChange={(event) => updateGuest(index, 'fullName', event.target.value)} />
                </label>
                <label>
                  Alergias o restricciones alimentarias
                  <input value={guest.allergies || ''} onChange={(event) => updateGuest(index, 'allergies', event.target.value)} placeholder="Opcional" />
                </label>
              </fieldset>
            ))}
            <p className="rsvp-count">Confirmados: {confirmedCount} de {rsvp.maxGuestsAllowed}</p>
            <label>
              Mensaje para los novios
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Opcional" rows="3" />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            {success && <p className="form-success" role="status">{success}</p>}
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Enviar confirmación'}
            </button>
            {confirmationSaved && (
              <button className="secondary-button print-confirmation" type="button" onClick={() => window.print()}>
                Descargar resumen PDF
              </button>
            )}
          </form>
        </section>
      )}

      <section className="print-summary">
        <p className="eyebrow">Confirmación de asistencia</p>
        <h1>{invitation.partnerOneName} <span>&amp;</span> {invitation.partnerTwoName}</h1>
        <p>{formatDate(invitation.weddingDate)}</p>
        {rsvp && (
          <>
            <h2>Invitados confirmados</h2>
            <ul>
              {guests.filter((guest) => guest.attendanceStatus === 'CONFIRMED').map((guest) => (
                <li key={guest.id || guest.fullName}>{guest.fullName}</li>
              ))}
            </ul>
          </>
        )}
        <h2>Información principal</h2>
        <p><strong>Lugar:</strong> {invitation.venueName || 'Por confirmar'}</p>
        <p><strong>Dirección:</strong> {visibleAddress || 'Por confirmar'}</p>
        {invitation.dressCode && <p><strong>Vestimenta:</strong> {invitation.dressCode}</p>}
        {schedule.length > 0 && (
          <>
            <h2>Agenda</h2>
            <ul>
              {schedule.map((item, index) => (
                <li key={`${item.title}-${index}`}>
                  <strong>{item.time || item.startsAt || ''}</strong> {item.title}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {footerPhoto && (
        <section className="footer-photo-section">
          <img src={getImageUrl(footerPhoto.imageUrl)} alt={footerPhoto.caption || 'Foto de los novios'} />
        </section>
      )}
    </div>
  )
}
