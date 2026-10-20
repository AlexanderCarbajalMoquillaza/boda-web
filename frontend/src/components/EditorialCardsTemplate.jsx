import React, { useState } from 'react'
import { getImageUrl } from '../services/api'

export function EditorialCardsTemplate({
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
  _mapQuery,
  mapExternalUrl,
  updateGuest,
  changeAttendeesCount,
  openMap,
  handleSubmit,
  formatDate,
}) {
  const [copiedAccount, setCopiedAccount] = useState(false)

  // Separar ubicaciones para Ceremonia y Recepción si existen
  const ceremonyLocation = locations.find((loc) => /ceremonia|iglesia|templo|misa/i.test(loc.type || loc.name)) || locations[0]
  const receptionLocation = locations.find((loc) => /recepci|fiesta|celebraci|sal[oó]n|jard[ií]n/i.test(loc.type || loc.name)) || locations[1] || locations[0]

  const ceremonyTime = schedule.find((item) => /ceremonia|misa|iglesia/i.test(item.title))?.time || '15:00'
  const receptionTime = schedule.find((item) => /recepci|fiesta|cena|brindis/i.test(item.title))?.time || '18:00'

  function copyText(text) {
    if (!text) return
    navigator.clipboard?.writeText(text)
    setCopiedAccount(true)
    setTimeout(() => setCopiedAccount(false), 2500)
  }

  // Paleta de colores para dress code: personalizable desde el panel por los novios
  const dressCodePalette = React.useMemo(() => {
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
  }, [invitation.dressCodeColorsJson, invitation.accentColor, invitation.primaryColor])

  return (
    <div className="editorial-cards-theme">
      {/* 1. PANTALLA DE INICIO (Exacta a la imagen adjunta) */}
      {!isOpened && (
        <div className={`editorial-cover-screen ${isOpening ? 'is-opening' : ''}`}>
          {/* Esquinas florales botánicas transparentes adaptables a cualquier formato de pantalla (PC, tablet, móvil) */}
          <img
            src="/illustrations/editorial-corner-top-left.png"
            alt=""
            className="editorial-corner-floral corner-tl"
            aria-hidden="true"
          />
          <img
            src="/illustrations/editorial-corner-bottom-right.png"
            alt=""
            className="editorial-corner-floral corner-br"
            aria-hidden="true"
          />

          <div className="editorial-cover-center">
            {/* Nombres en tipografía cursiva/caligráfica elegante */}
            <div className="editorial-cover-names">
              <span className="editorial-script-name">{invitation.partnerOneName || 'Novio'}</span>
              <span className="editorial-script-amp">&amp;</span>
              <span className="editorial-script-name">{invitation.partnerTwoName || 'Novia'}</span>
            </div>

            {/* Dos corazones entrelazados en vector caligráfico */}
            <div className="editorial-hearts-icon" aria-hidden="true">
              <svg width="48" height="40" viewBox="0 0 54 44" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path
                  d="M19 12 C14 3.5, 2.5 7.5, 2.5 19 C2.5 28.5, 11.5 36.5, 21 42 C29.5 36.5, 36.5 29, 36.5 19 C36.5 7.5, 25 3.5, 21 12 Z"
                  strokeWidth="2.2"
                />
                <path
                  d="M37.5 17.5 C34 10.5, 26 12.5, 26 21 C26 28.5, 33 34.5, 40 39.5 C46.5 34.5, 52 28.5, 52 21 C52 12.5, 43 9.5, 38.5 17 Z"
                  strokeWidth="1.9"
                  opacity="0.9"
                />
              </svg>
            </div>

            {/* Botón pill: VER INVITACIÓN */}
            <button
              type="button"
              className="editorial-cover-button"
              onClick={openInvitation}
              disabled={isOpening}
              aria-label="Ver invitación"
            >
              <span>{isOpening ? 'ABRIENDO...' : 'VER INVITACIÓN'}</span>
            </button>

            {/* Datos personalizados del invitado si existen */}
            {rsvp && (
              <div className="editorial-cover-guest-badge">
                <p className="cover-guest-title">{rsvp.contactName}</p>
                <p className="cover-guest-passes">
                  Hemos reservado <strong>{rsvp.maxGuestsAllowed}</strong> pase{rsvp.maxGuestsAllowed === 1 ? '' : 's'} para ti
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. INVITACIÓN ABIERTA: ESTRUCTURA DE CARDS EDITORIALES */}
      <div className="editorial-body-container">
        {/* Control de audio flotante (botón circular con nota musical como en el video) */}
        {audio && (
          <aside className="editorial-floating-music" aria-label="Control musical">
            <audio id="wedding-audio" src={getImageUrl(audio.audioUrl)} loop />
            <button
              type="button"
              className={`floating-audio-pill ${musicOn ? 'is-playing' : ''}`}
              onClick={toggleMusic}
              title={musicOn ? 'Pausar música' : 'Reproducir música'}
            >
              <span className="audio-note-icon">♫</span>
            </button>
          </aside>
        )}

        {/* CARD 1: HERO / BIENVENIDA & CUENTA REGRESIVA */}
        <section className="editorial-card hero-card">
          <div className="card-inner-frame">
            <p className="editorial-eyebrow">Nuestra Boda</p>
            <h1 className="editorial-couple-title">
              <span className="editorial-title-name">{invitation.partnerOneName}</span>
              <span className="editorial-title-amp">&amp;</span>
              <span className="editorial-title-name">{invitation.partnerTwoName}</span>
            </h1>
            <p className="editorial-wedding-date">{formatDate(invitation.weddingDate)}</p>

            {/* Contador con cajitas estilizadas */}
            <div className="editorial-countdown" aria-label="Cuenta regresiva">
              <div className="count-box">
                <span className="count-num">{countdown.days}</span>
                <span className="count-label">Días</span>
              </div>
              <span className="count-sep">:</span>
              <div className="count-box">
                <span className="count-num">{String(countdown.hours).padStart(2, '0')}</span>
                <span className="count-label">Horas</span>
              </div>
              <span className="count-sep">:</span>
              <div className="count-box">
                <span className="count-num">{String(countdown.minutes).padStart(2, '0')}</span>
                <span className="count-label">Min</span>
              </div>
              <span className="count-sep">:</span>
              <div className="count-box">
                <span className="count-num">{String(countdown.seconds).padStart(2, '0')}</span>
                <span className="count-label">Seg</span>
              </div>
            </div>

            {invitation.showWelcome !== false && (
              <p className="editorial-welcome-quote">
                &ldquo;{invitation.welcomeMessage || 'Nos encantará celebrar este día tan especial contigo y guardar juntos un recuerdo inolvidable.'}&rdquo;
              </p>
            )}

            {/* Slider de fotos si existen */}
            {heroPhotos.length > 0 && (
              <div className="editorial-hero-photos">
                <img
                  className="editorial-hero-img"
                  src={getImageUrl(heroPhotos[heroIndex % heroPhotos.length].imageUrl)}
                  alt={heroPhotos[heroIndex % heroPhotos.length].caption || 'Foto de los novios'}
                />
                {heroPhotos.length > 1 && (
                  <div className="editorial-dots">
                    {heroPhotos.map((photo, index) => (
                      <button
                        key={photo.id}
                        type="button"
                        className={index === heroIndex % heroPhotos.length ? 'active' : ''}
                        onClick={() => setHeroIndex(index)}
                        aria-label={`Ver foto ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* CARD 2: CEREMONIA Y RECEPCIÓN (Con bocetos arquitectónicos y botones pill) */}
        {invitation.showLocation !== false && (
          <section className="editorial-card locations-card">
            <div className="locations-wrapper">
              {/* Bloque Ceremonia */}
              <article className="location-moment">
                <div className="moment-sketch church-sketch" aria-hidden="true">
                  {/* Icono profesional arquitectónico de Iglesia con cruz y rosetón */}
                  <svg width="74" height="74" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M32 4 L32 12 M28 7 L36 7" />
                    <path d="M26 18 L32 12 L38 18" />
                    <path d="M26 18 L26 28 L38 28 L38 18" />
                    <path d="M30 24 A2 2 0 0 1 34 24" />
                    <circle cx="32" cy="25" r="0.8" fill="currentColor" />
                    <path d="M20 28 L44 28" />
                    <path d="M14 38 L32 25 L50 38" />
                    <circle cx="32" cy="34" r="4.5" />
                    <circle cx="32" cy="34" r="1.5" fill="currentColor" />
                    <path d="M32 29.5 L32 38.5 M27.5 34 L36.5 34" strokeWidth="1.2" />
                    <path d="M16 38 L16 58 M48 38 L48 58" />
                    <path d="M20 44 C20 41.5 24 41.5 24 44 L24 50 L20 50 Z" />
                    <path d="M40 44 C40 41.5 44 41.5 44 44 L44 50 L40 50 Z" />
                    <path d="M26 58 L26 46 C26 42.5 38 42.5 38 46 L38 58" />
                    <path d="M28.5 58 L28.5 48 C28.5 45.5 35.5 45.5 35.5 48 L35.5 58" />
                    <path d="M32 47 L32 58" strokeWidth="1.2" />
                    <path d="M12 58 L52 58" />
                    <path d="M8 61 L56 61" />
                  </svg>
                </div>

                <h2 className="moment-title">CEREMONIA</h2>
                <p className="moment-time">{ceremonyTime}</p>
                <p className="moment-venue-name">{ceremonyLocation?.name || invitation.venueName || 'Iglesia principal'}</p>
                <p className="moment-venue-address">{ceremonyLocation?.address || visibleAddress || 'Dirección de la ceremonia'}</p>

                {(ceremonyLocation?.mapUrl || visibleAddress || ceremonyLocation?.name) && (
                  <button
                    type="button"
                    className="editorial-pill-btn"
                    onClick={() => openMap(ceremonyLocation?.mapUrl || mapExternalUrl)}
                  >
                    VER UBICACIÓN
                  </button>
                )}
              </article>

              <div className="location-divider-line" aria-hidden="true" />

              {/* Bloque Recepción */}
              <article className="location-moment">
                <div className="moment-sketch venue-sketch" aria-hidden="true">
                  {/* Icono profesional de copas de champán en brindis con destello */}
                  <svg width="74" height="74" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <g transform="rotate(14 26 36)">
                      <path d="M20 12 L30 12 L28 28 C27 34 23 34 22 28 Z" />
                      <path d="M21 18 L29 18" strokeDasharray="1.5 1.5" strokeWidth="1.3" />
                      <path d="M25 34 L25 48" />
                      <path d="M17 48 C17 48 20 49 25 49 C30 49 33 48 33 48" />
                    </g>
                    <g transform="rotate(-14 38 36)">
                      <path d="M34 12 L44 12 L42 28 C41 34 37 34 36 28 Z" />
                      <path d="M35 18 L43 18" strokeDasharray="1.5 1.5" strokeWidth="1.3" />
                      <path d="M39 34 L39 48" />
                      <path d="M31 48 C31 48 34 49 39 49 C44 49 47 48 47 48" />
                    </g>
                    <path d="M32 6 L33.2 9.5 L36.7 10.7 L33.2 11.9 L32 15.4 L30.8 11.9 L27.3 10.7 L30.8 9.5 Z" fill="currentColor" stroke="none" />
                    <circle cx="32" cy="18" r="1" fill="currentColor" />
                    <circle cx="28" cy="15" r="0.75" fill="currentColor" />
                    <circle cx="36" cy="16" r="0.75" fill="currentColor" />
                    <circle cx="22" cy="24" r="0.8" fill="currentColor" />
                    <circle cx="42" cy="24" r="0.8" fill="currentColor" />
                  </svg>
                </div>

                <h2 className="moment-title">RECEPCIÓN</h2>
                <p className="moment-time">{receptionTime}</p>
                <p className="moment-venue-name">{receptionLocation?.name || invitation.venueName || 'Salón de eventos'}</p>
                <p className="moment-venue-address">{receptionLocation?.address || visibleAddress || 'Dirección de la recepción'}</p>

                {(receptionLocation?.mapUrl || visibleAddress || receptionLocation?.name) && (
                  <button
                    type="button"
                    className="editorial-pill-btn"
                    onClick={() => openMap(receptionLocation?.mapUrl || mapExternalUrl)}
                  >
                    VER UBICACIÓN
                  </button>
                )}
              </article>
            </div>
          </section>
        )}

        {/* CARD DE NUESTRA HISTORIA (SI ESTÁ ACTIVA) */}
        {invitation.showStory !== false && (storyPhotos.length > 0 || invitation.storyText) && (
          <section className="editorial-card story-card">
            <p className="editorial-eyebrow">Nuestra historia</p>
            <h2 className="editorial-section-title">UN MOMENTO PARA RECORDAR</h2>
            <p className="memory-lead">
              {invitation.storyText || storyPhotos[0]?.caption || 'Gracias por acompañarnos en este capítulo tan especial de nuestras vidas.'}
            </p>
            {storyPhotos.length > 0 && (
              <div className="editorial-gallery-grid">
                {storyPhotos.map((photo) => (
                  <div className="editorial-gallery-item" key={photo.id}>
                    <img src={getImageUrl(photo.imageUrl)} alt={photo.caption || 'Historia de los novios'} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* CARD 3: ITINERARIO CON LÍNEA DE TIEMPO Y BOCETOS */}
        {invitation.showSchedule !== false && schedule.length > 0 && (
          <section className="editorial-card schedule-card">
            <h2 className="editorial-section-title">ITINERARIO</h2>
            <p className="editorial-section-subtitle">Los momentos que compartiremos juntos</p>
            <div className="editorial-timeline">
              {schedule.map((item, index) => (
                <div className="timeline-row" key={`${item.title}-${index}`}>
                  <div className="timeline-time-col">
                    <span className="timeline-time">{item.time || item.startsAt || ''}</span>
                  </div>
                  <div className="timeline-node-col">
                    <div className="timeline-node-dot" />
                    {index < schedule.length - 1 && <div className="timeline-node-line" />}
                  </div>
                  <div className="timeline-info-col">
                    <h3 className="timeline-event-title">{item.title}</h3>
                    {item.notes && <p className="timeline-event-notes">{item.notes}</p>}
                    {item.responsible && <span className="timeline-event-resp">{item.responsible}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CARD 4: SUGERENCIA DE REGALOS (CARD CON CORTE CURVO / ARCO Y FONDO EN COLOR DE ACENTO) */}
        {invitation.showGiftRegistry !== false && (
          <section className="editorial-card gift-wave-card">
            {/* Corte superior en curva/onda con SVG */}
            <div className="wave-header-svg" aria-hidden="true">
              <svg viewBox="0 0 500 70" preserveAspectRatio="none">
                <path d="M0,70 C150,0 350,0 500,70 L500,70 L0,70 Z" fill="currentColor" />
              </svg>
            </div>

            <div className="gift-card-body">
              <h2 className="gift-card-title">SUGERENCIA DE REGALOS</h2>
              <p className="gift-card-lead">
                Tu presencia es el mejor regalo pero si quieres tener un detalle con nosotros aquí te dejamos algunas opciones:
              </p>

              {/* Botón de Mesa de Regalos / Enlace externo */}
              {(invitation.giftRegistryUrl || giftOptions.some((g) => g.url)) && (
                <div className="gift-button-wrap">
                  <a
                    className="gift-pill-white-btn"
                    href={invitation.giftRegistryUrl || giftOptions.find((g) => g.url)?.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    VER MESA DE REGALOS
                  </a>
                </div>
              )}

              {/* Opciones de cuentas bancarias y transferencias con botón para copiar datos */}
              <div className="gift-banking-box">
                <h3 className="banking-title">CUENTA BANCARIA</h3>
                {giftOptions.length > 0 ? (
                  <div className="banking-details-list">
                    {giftOptions.map((opt, i) => (
                      <div className="banking-detail-item" key={i}>
                        <p className="banking-type">{opt.title || opt.type}</p>
                        <p className="banking-info">{opt.details}</p>
                        {opt.details && (
                          <button
                            type="button"
                            className="banking-copy-btn"
                            onClick={() => copyText(opt.details)}
                          >
                            {copiedAccount ? '¡Copiado!' : 'Copiar datos'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="banking-placeholder-note">
                    Para transferencias o sobres, comunícate con nosotros para brindarte los datos bancarios.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* CARD 5: DRESS CODE (CÓDIGO DE VESTIMENTA CON PALETA CIRCULAR Y NOTA DE NOVIA) */}
        {invitation.showDressCode !== false && (
          <section className="editorial-card dress-code-card">
            <h2 className="editorial-section-title">DRESS CODE</h2>

            {/* Código de vestimenta establecido por los novios */}

            <p className="dress-code-main-text">
              {invitation.dressCode || 'Formal / Rigurosa etiqueta'}
            </p>

            {invitation.dressCodeImageUrl && (
              <img
                className="dress-code-uploaded-img"
                src={getImageUrl(invitation.dressCodeImageUrl)}
                alt="Referencia de vestimenta"
              />
            )}

            {/* Paleta de colores sugerida con círculos swatches (si los novios la habilitaron) */}
            {invitation.showDressCodePalette && dressCodePalette.length > 0 && (
              <div className="dress-code-palette-block">
                <p className="palette-label">PALETA DE COLORES</p>
                <div className="palette-swatches-row">
                  {dressCodePalette.map((color, i) => (
                    <span
                      className="palette-swatch-dot"
                      key={i}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Nota de cortesía tradicional: El blanco reservado para la novia */}
            <p className="dress-code-bride-note">
              El color blanco está reservado solo para la novia.
            </p>
          </section>
        )}

        {/* CARD DE PREGUNTAS FRECUENTES (SI HAY ACTIVAS) */}
        {invitation.showFaq !== false && faqs.length > 0 && (
          <section className="editorial-card faq-card">
            <h2 className="editorial-section-title">PREGUNTAS FRECUENTES</h2>
            <div className="editorial-faq-list" style={{ textAlign: 'left', maxWidth: '440px', margin: '20px auto 0' }}>
              {faqs.map((item, index) => (
                <details key={`${item.question}-${index}`} style={{ margin: '12px 0', padding: '10px 14px', background: '#fdfaf7', border: '1px solid #eee6de', borderRadius: '10px' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--accent-color, #7A1C2E)' }}>{item.question}</summary>
                  <p style={{ margin: '8px 0 0', color: '#555', fontSize: '0.88rem', lineHeight: 1.5 }}>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CARD DE MESAS (SI ESTÁ ACTIVA) */}
        {invitation.showTables !== false && tables.length > 0 && (
          <section className="editorial-card tables-card">
            <h2 className="editorial-section-title">DISTRIBUCIÓN DE MESAS</h2>
            <div className="table-list" style={{ maxWidth: '440px', margin: '20px auto 0' }}>
              {tables.map((item, index) => (
                <article key={`${item.name}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#fdfaf7', border: '1px solid #eee6de', borderRadius: '10px', marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--accent-color, #7A1C2E)' }}>{item.name || `Mesa ${index + 1}`}</strong>
                  <span style={{ color: '#666' }}>{item.guests || item.capacity || ''}</span>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* CARD 6: FOTOGRAFÍAS / RECUERDOS */}
        <section className="editorial-card photos-memory-card">
          <div className="memory-camera-sketch" aria-hidden="true">
            {/* Icono profesional de cámara fotográfica con destello de recuerdos */}
            <svg width="68" height="68" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M24 19 L28 13 L36 13 L40 19 Z" />
              <path d="M16 16 L16 19 M14 16 L18 16" />
              <path d="M46 16 L46 19 M44 16 L48 16" />
              <rect x="10" y="19" width="44" height="34" rx="5" />
              <rect x="42" y="23" width="7" height="4.5" rx="1.5" />
              <circle cx="16" cy="25" r="1.5" fill="currentColor" />
              <circle cx="32" cy="36" r="12" />
              <circle cx="32" cy="36" r="8" />
              <circle cx="32" cy="36" r="4" />
              <path d="M29 32 A 4.5 4.5 0 0 1 35 32" strokeWidth="1.3" />
              <path d="M52 8 L53 11 L56 12 L53 13 L52 16 L51 13 L48 12 L51 11 Z" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <h2 className="editorial-section-title">FOTOGRAFÍAS</h2>
          <p className="memory-lead">
            Captura cada momento inolvidable. Ayúdanos a guardar todos los recuerdos de este gran día subiendo tus fotos favoritas.
          </p>

          {/* Si hay fotos en la galería de recuerdos */}
          {photos.filter((p) => p.section === 'GALLERY').length > 0 && (
            <div className="editorial-gallery-grid">
              {photos.filter((p) => p.section === 'GALLERY').slice(0, 6).map((photo) => (
                <div className="editorial-gallery-item" key={photo.id}>
                  <img src={getImageUrl(photo.imageUrl)} alt={photo.caption || 'Foto de los novios'} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CARD 7: BUENOS DESEOS & CONFIRMACIÓN RSVP (Con anillos entrelazados y firma) */}
        <section className="editorial-card wishes-rsvp-card">
          <div className="rings-sketch-wrap" aria-hidden="true">
            {/* Icono profesional de alianzas entrelazadas con solitario de diamante brillante */}
            <svg width="74" height="60" viewBox="0 0 68 54" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="26" cy="32" rx="15" ry="15" />
              <ellipse cx="26" cy="32" rx="11" ry="11" strokeDasharray="2 2" strokeWidth="1.2" opacity="0.6" />
              <ellipse cx="42" cy="32" rx="15" ry="15" />
              <ellipse cx="42" cy="32" rx="11" ry="11" strokeDasharray="2 2" strokeWidth="1.2" opacity="0.6" />
              <path d="M42 9 L47 17 L37 17 Z" fill="none" />
              <path d="M40 9 L44 9 L47 17 L37 17 Z" />
              <path d="M42 9 L42 17" strokeWidth="1.2" />
              <path d="M37 17 L42 15 L47 17" strokeWidth="1.2" />
              <circle cx="38" cy="17" r="1" fill="currentColor" />
              <circle cx="46" cy="17" r="1" fill="currentColor" />
              <path d="M42 2 L42.8 5 L46 6 L42.8 7 L42 10 L41.2 7 L38 6 L41.2 5 Z" fill="currentColor" stroke="none" />
              <circle cx="50" cy="8" r="0.8" fill="currentColor" />
            </svg>
          </div>

          <p className="wishes-heartfelt-quote">
            Contamos los días para abrazarte, brindar juntos y vivir el día más feliz de nuestras vidas. ¡Te esperamos!
          </p>
          <p className="wishes-affection">Con todo nuestro amor,</p>
          <p className="wishes-couple-signature">
            {invitation.partnerOneName} y {invitation.partnerTwoName}
          </p>

          {/* FORMULARIO RSVP INTEGRADO */}
          {rsvp ? (
            <div className="editorial-rsvp-box">
              <div className="rsvp-box-header">
                <h3 className="rsvp-box-title">CONFIRMAR ASISTENCIA</h3>
                <p className="rsvp-box-limit">
                  Tienes <strong>{rsvp.maxGuestsAllowed}</strong> {rsvp.maxGuestsAllowed === 1 ? 'pase reservado' : 'pases reservados'}
                  {confirmedCount > 0 && <span> (Confirmados actualmente: {confirmedCount})</span>}.
                </p>
              </div>

              <form className="editorial-rsvp-form" onSubmit={handleSubmit}>
                <label className="editorial-form-label">
                  ¿Cuántas personas asistirán?
                  <select
                    className="editorial-select"
                    value={attendeesCount}
                    onChange={(event) => changeAttendeesCount(event.target.value)}
                    required
                  >
                    <option value="" disabled>Selecciona una cantidad</option>
                    {Array.from({ length: rsvp.maxGuestsAllowed }, (_, index) => index + 1).map((amount) => (
                      <option value={amount} key={amount}>
                        {amount} {amount === 1 ? 'persona' : 'personas'}
                      </option>
                    ))}
                  </select>
                </label>

                {guests.map((guest, index) => (
                  <div className="editorial-guest-fieldset" key={`${guest.id || 'new'}-${index}`}>
                    <span className="guest-badge-num">Invitado {index + 1}</span>
                    <label className="editorial-form-label">
                      Nombre completo
                      <input
                        className="editorial-input"
                        value={guest.fullName}
                        onChange={(event) => updateGuest(index, 'fullName', event.target.value)}
                        placeholder="Nombre y apellido"
                        required
                      />
                    </label>
                    <label className="editorial-form-label">
                      Alergias o menú especial (opcional)
                      <input
                        className="editorial-input"
                        value={guest.allergies || ''}
                        onChange={(event) => updateGuest(index, 'allergies', event.target.value)}
                        placeholder="Ej. Vegetariano, celíaco..."
                      />
                    </label>
                  </div>
                ))}

                <label className="editorial-form-label">
                  Déjanos tus buenos deseos
                  <textarea
                    className="editorial-textarea"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Escribe aquí un mensaje especial para nosotros..."
                    rows="3"
                  />
                </label>

                {error && <p className="editorial-form-error">{error}</p>}
                {success && <p className="editorial-form-success">{success}</p>}

                <button
                  type="submit"
                  className="editorial-submit-pill-btn"
                  disabled={saving}
                >
                  {saving ? 'Guardando confirmación...' : 'ENVIAR CONFIRMACIÓN'}
                </button>

                {confirmationSaved && (
                  <button
                    type="button"
                    className="editorial-print-btn"
                    onClick={() => window.print()}
                  >
                    Descargar resumen en PDF
                  </button>
                )}
              </form>
            </div>
          ) : (
            <p className="editorial-public-note">
              La confirmación de pases se realiza a través del enlace personalizado enviado a cada familia.
            </p>
          )}
        </section>

        {/* Resumen imprimible */}
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
        </section>

        {/* Foto de pie de página si existe */}
        {footerPhoto && (
          <div className="editorial-footer-photo">
            <img src={getImageUrl(footerPhoto.imageUrl)} alt={footerPhoto.caption || 'Foto de los novios'} />
          </div>
        )}
      </div>
    </div>
  )
}
