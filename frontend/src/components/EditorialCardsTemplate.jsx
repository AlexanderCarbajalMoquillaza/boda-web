import React, { useState } from 'react'
import { getImageUrl } from '../services/api'
import { WeddingMusicPlayer } from './WeddingMusicPlayer'
import { ActivityIcon } from './ActivityIcon'

const seaGlassTopLeft = '/illustrations/seaglass-corner-top-left.png'
const seaGlassBottomRight = '/illustrations/seaglass-corner-bottom-right.png'
const seaGlassDividerCluster = '/illustrations/seaglass-divider-cluster.png'
const seaGlassBouquet = '/illustrations/seaglass-bouquet.png'

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

  // Paleta de colores para dress code
  const dressCodePalette = React.useMemo(() => {
    try {
      const parsed = JSON.parse(invitation.dressCodeColorsJson || '[]')
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch {
      // fallback
    }
    return [
      invitation.accentColor || '#6FA6B8',
      invitation.primaryColor || '#A8D5D1',
      '#D8C6A5',
      '#E7F1EC',
      '#B8C9CE',
    ]
  }, [invitation.dressCodeColorsJson, invitation.accentColor, invitation.primaryColor])

  const initialOne = invitation.partnerOneName ? invitation.partnerOneName.trim().charAt(0).toUpperCase() : 'A'
  const initialTwo = invitation.partnerTwoName ? invitation.partnerTwoName.trim().charAt(0).toUpperCase() : 'B'

  const hasFamilyBlessing = Boolean(
    invitation.brideMotherName ||
    invitation.brideFatherName ||
    invitation.groomMotherName ||
    invitation.groomFatherName ||
    invitation.godmotherName ||
    invitation.godfatherName
  )

  return (
    <div className="editorial-cards-theme">
      {/* 1. PANTALLA DE INICIO (Plantilla 2) */}
      {!isOpened && (
        <div className={`editorial-cover-screen ${isOpening ? 'is-opening' : ''}`}>
          {/* Esquinas florales botánicas Sea Glass adaptables */}
          <img
            src={seaGlassTopLeft}
            alt=""
            className="editorial-corner-floral corner-tl"
            aria-hidden="true"
          />
          <img
            src={seaGlassBottomRight}
            alt=""
            className="editorial-corner-floral corner-br"
            aria-hidden="true"
          />

          <div className="editorial-cover-center">
            {/* Texto Nuestra Boda superior */}
            <p className="eyebrow eyebrow-enhanced cover-eyebrow-higher">Nuestra Boda</p>

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
              <div className="editorial-cover-guest-badge cover-guest-family-lower">
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
      <div className={`editorial-body-container ${!isOpened ? 'invitation-body-hidden' : ''}`}>
        {audio && (
          <audio id="wedding-audio" src={getImageUrl(audio.audioUrl)} loop />
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

            {/* Contador Minimalista Unificado */}
            <div className="boho-countdown-section editorial-inline-countdown">
              <p className="boho-countdown-title">FALTAN</p>
              <div className="boho-countdown-numbers">
                <span className="num">{countdown.days}</span>
                <span className="colon">:</span>
                <span className="num">{String(countdown.hours).padStart(2, '0')}</span>
                <span className="colon">:</span>
                <span className="num">{String(countdown.minutes).padStart(2, '0')}</span>
                <span className="colon">:</span>
                <span className="num">{String(countdown.seconds).padStart(2, '0')}</span>
              </div>
              <div className="boho-countdown-labels">
                <span>Días</span>
                <span>Horas</span>
                <span>Min</span>
                <span>Seg</span>
              </div>
            </div>

            {invitation.showWelcome !== false && (
              <div className="editorial-welcome-block">
                <p className="editorial-welcome-quote">
                  &ldquo;{invitation.welcomeMessage || 'Nos encantará celebrar este día tan especial contigo y guardar juntos un recuerdo inolvidable.'}&rdquo;
                </p>
                {invitation.welcomeCitation && (
                  <p className="boho-verse-cite" style={{ textAlign: 'center', marginTop: '6px' }}>
                    {invitation.welcomeCitation}
                  </p>
                )}
              </div>
            )}

            {/* Logo personalizado o iniciales de los novios */}
            <div className="boho-monogram-section" style={{ margin: '14px 0 20px' }}>
              {invitation.customLogoUrl ? (
                <div className="custom-couple-logo-box">
                  <img src={getImageUrl(invitation.customLogoUrl)} alt="Logo de los novios" className="custom-couple-logo-img" />
                </div>
              ) : (
                <div className="boho-monogram-box">
                  <span className="mono-letter">{initialOne}</span>
                  <span className="mono-bar" aria-hidden="true">|</span>
                  <span className="mono-letter">{initialTwo}</span>
                </div>
              )}
            </div>

            {/* Reproductor de música inline */}
            {audio && (
              <WeddingMusicPlayer
                audio={audio}
                musicOn={musicOn}
                toggleMusic={toggleMusic}
              />
            )}

            {heroPhotos.length > 0 && (
              <div className="editorial-hero-gallery">
                <img
                  className="editorial-hero-img"
                  src={getImageUrl(heroPhotos[heroIndex % heroPhotos.length].imageUrl)}
                  alt={heroPhotos[heroIndex % heroPhotos.length].caption || 'Foto de los novios'}
                />
                {heroPhotos.length > 1 && (
                  <div className="editorial-hero-dots">
                    {heroPhotos.map((photo, i) => (
                      <button
                        key={photo.id}
                        type="button"
                        className={`editorial-dot ${i === (heroIndex % heroPhotos.length) ? 'is-active' : ''}`}
                        onClick={() => setHeroIndex(i)}
                        aria-label={`Ver foto ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* DIVISOR FLORAL SEA GLASS */}
        <div className="cards-floral-divider-wrap" aria-hidden="true">
          <img src={seaGlassDividerCluster} alt="" className="cards-floral-divider" />
        </div>

        {/* CARD: BENDICIÓN DE PADRES Y PADRINOS */}
        {hasFamilyBlessing && (
          <section className="editorial-card family-blessing-card">
            <h2 className="editorial-section-title">NUESTRAS FAMILIAS</h2>
            <p className="boho-parents-lead" style={{ textAlign: 'center', marginBottom: '18px' }}>
              Con nuestro amor, la bendición de Dios y la de nuestros padres:
            </p>
            <div className="boho-parents-grid">
              {(invitation.brideMotherName || invitation.brideFatherName) && (
                <div className="parents-block">
                  <p className="parents-role">Padres de la novia</p>
                  <p className="parents-names">
                    {[invitation.brideMotherName, invitation.brideFatherName].filter(Boolean).join(' & ')}
                  </p>
                </div>
              )}
              {(invitation.groomMotherName || invitation.groomFatherName) && (
                <div className="parents-block">
                  <p className="parents-role">Padres del novio</p>
                  <p className="parents-names">
                    {[invitation.groomMotherName, invitation.groomFatherName].filter(Boolean).join(' & ')}
                  </p>
                </div>
              )}
              {(invitation.godmotherName || invitation.godfatherName) && (
                <div className="parents-block godparents-block">
                  <p className="parents-role">Padrinos</p>
                  <p className="parents-names">
                    {[invitation.godmotherName, invitation.godfatherName].filter(Boolean).join(' & ')}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* CARD 2: CEREMONIA Y RECEPCIÓN CON ICONOGRAFÍA FINA */}
        {invitation.showLocation !== false && (
          <section className="editorial-card locations-card">
            <h2 className="editorial-section-title">DÓNDE &amp; CUÁNDO</h2>

            <div className="locations-duo-grid">
              <article className="location-moment">
                <div className="moment-sketch" aria-hidden="true">
                  <ActivityIcon title="Ceremonia" className="location-svg-icon" />
                </div>
                <span className="moment-tag">CEREMONIA</span>
                <p className="moment-time">{ceremonyTime} HRS</p>
                <h3 className="moment-venue-name">{ceremonyLocation?.name || 'Parroquia'}</h3>
                <p className="moment-venue-address">{ceremonyLocation?.address || visibleAddress}</p>
                {ceremonyLocation?.mapUrl && (
                  <button
                    type="button"
                    className="moment-map-action-btn"
                    onClick={() => openMap(ceremonyLocation.mapUrl)}
                  >
                    <span>Ver mapa</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                )}
              </article>

              <article className="location-moment">
                <div className="moment-sketch" aria-hidden="true">
                  <ActivityIcon title="Recepción" className="location-svg-icon" />
                </div>
                <span className="moment-tag">RECEPCIÓN</span>
                <p className="moment-time">{receptionTime} HRS</p>
                <h3 className="moment-venue-name">{receptionLocation?.name || invitation.venueName}</h3>
                <p className="moment-venue-address">{receptionLocation?.address || visibleAddress}</p>
                {(receptionLocation?.mapUrl || mapExternalUrl) && (
                  <button
                    type="button"
                    className="moment-map-action-btn"
                    onClick={() => openMap(receptionLocation?.mapUrl || mapExternalUrl)}
                  >
                    <span>Ver mapa</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                )}
              </article>
            </div>
          </section>
        )}

        {/* CARD 3: HISTORIA */}
        {invitation.showStory !== false && invitation.storyText && (
          <section className="editorial-card story-card">
            <h2 className="editorial-section-title">NUESTRA HISTORIA</h2>
            <div className="story-editorial-body">
              <p className="story-lead-paragraph">{invitation.storyText}</p>
            </div>
            {storyPhotos.length > 0 && (
              <div className="editorial-story-gallery">
                {storyPhotos.map((photo) => (
                  <img
                    key={photo.id}
                    className="editorial-story-img"
                    src={getImageUrl(photo.imageUrl)}
                    alt={photo.caption || 'Nuestra historia'}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* CARD 4: AGENDA DE ACTIVIDADES: Solo se muestran los ítems configurados en el panel de novios */}
        {invitation.showSchedule !== false && schedule.length > 0 && (
          <section className="editorial-card schedule-card">
            <h2 className="editorial-section-title">AGENDA DE ACTIVIDADES</h2>
            <div className="editorial-timeline">
              {schedule.map((item, index) => (
                <div className="timeline-row" key={`${item.title}-${index}`}>
                  <div className="timeline-time-col">
                    <span className="timeline-time">{item.time || item.startsAt || ''} HRS</span>
                  </div>
                  <div className="timeline-node-col">
                    <div className="timeline-node-dot" />
                    {index < schedule.length - 1 && <div className="timeline-node-line" />}
                  </div>
                  <div className="timeline-info-col">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ActivityIcon title={item.title} notes={item.notes} />
                      <h3 className="timeline-event-title" style={{ margin: 0 }}>{item.title}</h3>
                    </div>
                    {item.notes && <p className="timeline-event-notes">{item.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="cards-floral-divider-wrap" aria-hidden="true">
          <img src={seaGlassDividerCluster} alt="" className="cards-floral-divider" />
        </div>

        {/* CARD 5: SUGERENCIA DE REGALOS */}
        {invitation.showGiftRegistry !== false && (giftOptions.length > 0 || invitation.giftRegistryUrl) && (
          <section className="editorial-card gift-luxury-card">
            <div className="gift-card-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="8" width="18" height="13" rx="2" />
                <line x1="12" y1="8" x2="12" y2="21" />
                <path d="M12 8H7.5a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8z" />
              </svg>
            </div>

            <h2 className="editorial-section-title">SUGERENCIA DE REGALOS</h2>
            <p className="gift-card-lead">
              El mejor regalo es tu presencia en nuestra boda, pero si deseas tener un detalle con nosotros te dejamos estas opciones:
            </p>

            <div className="gift-options-layout">
              {giftOptions.length > 0 && (
                <div className="gift-box-item">
                  <div className="gift-box-header">
                    <span className="gift-pill-tag">TRANSFERENCIA BANCARIA</span>
                  </div>
                  <div className="banking-list-cards">
                    {giftOptions.map((opt, i) => (
                      <div className="banking-card-row" key={i}>
                        <div className="banking-card-info">
                          <p className="banking-type-label">{opt.title || opt.type}</p>
                          <p className="banking-account-number">{opt.details}</p>
                        </div>
                        {opt.details && (
                          <button
                            type="button"
                            className="banking-copy-action-btn"
                            onClick={() => copyText(opt.details)}
                          >
                            {copiedAccount ? '¡Copiado!' : 'Copiar datos'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(invitation.giftRegistryUrl || giftOptions.some((g) => g.url)) && (
                <div className="gift-box-item registry-external-item">
                  <a
                    className="gift-registry-action-btn"
                    href={invitation.giftRegistryUrl || giftOptions.find((g) => g.url)?.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>VER MESA DE REGALOS</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        <div className="cards-floral-divider-wrap" aria-hidden="true">
          <img src={seaGlassDividerCluster} alt="" className="cards-floral-divider" />
        </div>

        {/* CARD 6: DRESS CODE */}
        {invitation.showDressCode !== false && (
          <section className="editorial-card dress-code-card">
            <h2 className="editorial-section-title">CÓDIGO DE VESTIMENTA</h2>
            <p className="dress-code-main-text">
              {invitation.dressCode || 'Formal'}
            </p>

            <div className="dresscode-illustration-wrapper">
              <img
                src={invitation.dressCodeImageUrl ? getImageUrl(invitation.dressCodeImageUrl) : '/illustrations/dress-code-formal.png'}
                alt="Código de vestimenta"
                className="dresscode-illustration-image"
              />
            </div>

            {invitation.showDressCodePalette && dressCodePalette.length > 0 && (
              <div className="dress-code-palette-block" style={{ marginTop: '20px' }}>
                <p className="palette-label">PALETA DE COLORES</p>
                <div className="palette-swatches-row">
                  {dressCodePalette.map((color, i) => {
                    const colorVal = typeof color === 'string' ? color : color.hex
                    const labelVal = typeof color === 'object' ? color.label : ''
                    return (
                      <div className="swatch-item-wrap" key={i}>
                        <span
                          className="palette-swatch-dot"
                          style={{ backgroundColor: colorVal }}
                          title={labelVal || colorVal}
                        />
                        {labelVal && <span className="swatch-color-name">{labelVal}</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* CARD: CONFIRMACIÓN RSVP */}
        <section className="editorial-card wishes-rsvp-card">
          <h2 className="editorial-section-title">CONFIRMAR ASISTENCIA</h2>
          <p className="rsvp-card-lead">
            Por favor confirma tu presencia para acompañarnos en nuestro día.
          </p>

          {rsvp ? (
            <form className="editorial-rsvp-form" onSubmit={handleSubmit}>
              <div className="reservation-badge">
                <span className="badge-text">
                  Tienes <strong>{rsvp.maxGuestsAllowed}</strong> {rsvp.maxGuestsAllowed === 1 ? 'pase reservado' : 'pases reservados'}
                </span>
                {confirmedCount > 0 && (
                  <span className="confirmed-pill">{confirmedCount} confirmados</span>
                )}
              </div>

              <label className="editorial-form-field">
                <span>¿Cuántas personas asistirán?</span>
                <select
                  value={attendeesCount}
                  onChange={(e) => changeAttendeesCount(e.target.value)}
                  required
                >
                  <option value="" disabled>Selecciona número de personas</option>
                  {Array.from({ length: rsvp.maxGuestsAllowed }, (_, i) => i + 1).map((qty) => (
                    <option value={qty} key={qty}>{qty} {qty === 1 ? 'persona' : 'personas'}</option>
                  ))}
                </select>
              </label>

              {guests.map((guest, index) => (
                <div className="editorial-guest-fieldset" key={`${guest.id || 'new'}-${index}`}>
                  <label className="editorial-form-label">
                    Nombre completo del invitado {index + 1}
                    <input
                      className="editorial-input"
                      value={guest.fullName}
                      onChange={(event) => updateGuest(index, 'fullName', event.target.value)}
                      placeholder="Nombre y apellido"
                      required
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
                <div className="access-pass-cta-wrap" style={{ marginTop: '20px' }}>
                  <button
                    type="button"
                    className="access-pass-prominent-btn"
                    onClick={() => window.print()}
                  >
                    DESCARGAR PASE DE ACCESO (PDF)
                  </button>
                </div>
              )}
            </form>
          ) : (
            <p className="editorial-public-note" style={{ fontStyle: 'italic', textAlign: 'center' }}>
              La confirmación se realiza mediante el enlace personalizado enviado a cada familia.
            </p>
          )}
        </section>

        {/* CARD: CIERRE */}
        <section className="editorial-card closing-card">
          <p className="closing-eyebrow">¡GRACIAS POR SER PARTE DE NUESTRA VIDA!</p>
          <h2 className="closing-statement">Te esperamos</h2>
          <div className="boho-bottom-cluster" aria-hidden="true">
            <img src={seaGlassBouquet} alt="" />
          </div>
          {footerPhoto && (
            <div className="editorial-closing-photo-wrap" style={{ marginTop: '20px' }}>
              <img
                className="editorial-closing-photo"
                src={getImageUrl(footerPhoto.imageUrl)}
                alt={footerPhoto.caption || 'Foto de cierre'}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
