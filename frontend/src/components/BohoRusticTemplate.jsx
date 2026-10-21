import React, { useState } from 'react'
import { getImageUrl } from '../services/api'
import { WeddingMusicPlayer } from './WeddingMusicPlayer'
import { ActivityIcon } from './ActivityIcon'

const coverReferenceImage = '/illustrations/cover-envelope-reference.png'
const seaGlassTopLeft = '/illustrations/seaglass-corner-top-left.png'
const seaGlassBottomRight = '/illustrations/seaglass-corner-bottom-right.png'
const seaGlassDividerCluster = '/illustrations/seaglass-divider-cluster.png'
const seaGlassBouquet = '/illustrations/seaglass-bouquet.png'
const seaGlassVertical = '/illustrations/seaglass-vertical.png'

export function BohoRusticTemplate({
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
  envelopeMonogram,
  updateGuest,
  changeAttendeesCount,
  openMap,
  handleSubmit,
  formatDate,
}) {
  const [copiedAccount, setCopiedAccount] = useState(false)

  // Separar ubicaciones para Ceremonia y Recepción
  const ceremonyLocation = locations.find((loc) => /ceremonia|iglesia|templo|misa/i.test(loc.type || loc.name)) || locations[0]
  const receptionLocation = locations.find((loc) => /recepci|fiesta|celebraci|sal[oó]n|jard[ií]n/i.test(loc.type || loc.name)) || locations[1] || locations[0]

  const ceremonyTime = schedule.find((item) => /ceremonia|misa|iglesia/i.test(item.title))?.time || '15:00'
  const receptionTime = schedule.find((item) => /recepci|fiesta|cena|brindis/i.test(item.title))?.time || '17:00'

  function copyText(text) {
    if (!text) return
    navigator.clipboard?.writeText(text)
    setCopiedAccount(true)
    setTimeout(() => setCopiedAccount(false), 2500)
  }

  // Paleta de dress code personalizada (si está activada)
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

  // Iniciales de los novios para monograma C | C
  const initialOne = invitation.partnerOneName ? invitation.partnerOneName.trim().charAt(0).toUpperCase() : 'A'
  const initialTwo = invitation.partnerTwoName ? invitation.partnerTwoName.trim().charAt(0).toUpperCase() : 'B'

  // Fotos para el layout boho vertical
  const mainPhoto = heroPhotos[heroIndex % (heroPhotos.length || 1)] || photos[0]
  const secondPhoto = storyPhotos[0] || heroPhotos[1] || photos[1] || mainPhoto
  const thirdPhoto = storyPhotos[1] || heroPhotos[2] || photos[2] || secondPhoto

  const hasFamilyBlessing = Boolean(
    invitation.brideMotherName ||
    invitation.brideFatherName ||
    invitation.groomMotherName ||
    invitation.groomFatherName ||
    invitation.godmotherName ||
    invitation.godfatherName
  )

  return (
    <div className="boho-rustic-theme">
      {/* 1. PORTADA DE INICIO CON PALETA SEA GLASS Y ESPACIADOS MEJORADOS */}
      {!isOpened && (
        <div className={`invitation-cover ${isOpening ? 'is-opening' : ''}`}>
          {/* Múltiples flores estáticas en paleta Sea Glass para decorar ricamente la portada */}
          <img className="cover-floral-image cover-floral-tl" src={seaGlassTopLeft} alt="" aria-hidden="true" />
          <img className="cover-floral-image cover-floral-br" src={seaGlassBottomRight} alt="" aria-hidden="true" />
          <img className="cover-floral-image cover-floral-vertical" src={seaGlassVertical} alt="" aria-hidden="true" />
          <img className="cover-floral-image cover-floral-bottom" src={seaGlassBouquet} alt="" aria-hidden="true" />

          <div className="invitation-cover-content">
            <p className="eyebrow eyebrow-enhanced cover-eyebrow-higher">Nuestra Boda</p>
            
            <h1 className="cover-couple cover-couple-enhanced">
              <span className="cover-name">{invitation.partnerOneName}</span>
              <span className="cover-ampersand-unified">&amp;</span>
              <span className="cover-name">{invitation.partnerTwoName}</span>
            </h1>

            <p className="cover-date">{formatDate(invitation.weddingDate)}</p>

            <button
              className="envelope-visual"
              type="button"
              onClick={openInvitation}
              disabled={isOpening}
              aria-label="Abrir invitación"
            >
              <span className="envelope-image-wrap">
                <img
                  className="envelope-reference-image"
                  src={coverReferenceImage}
                  alt="Sobre de la invitación"
                />
                <span className="envelope-initials" aria-hidden="true">{envelopeMonogram}</span>
              </span>
              <span className="envelope-open-label">{isOpening ? 'Abriendo...' : 'Dar click para abrir'}</span>
            </button>

            {rsvp && (
              <div className="cover-guest-family-lower">
                <p className="cover-family">{rsvp.contactName}</p>
                <p className="cover-reservation">
                  Hemos reservado <strong>{rsvp.maxGuestsAllowed}</strong> pase{rsvp.maxGuestsAllowed === 1 ? '' : 's'} para ti
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. INVITACIÓN ABIERTA: DISEÑO BOHO RÚSTICO Y TERRACOTA */}
      <div className={`boho-scroll-container ${!isOpened ? 'invitation-body-hidden' : ''}`}>
        {/* Audio tag conectado para sincronización de audio */}
        {audio && (
          <audio id="wedding-audio" src={getImageUrl(audio.audioUrl)} loop />
        )}

        <div className="boho-column-sheet">
          {/* Bouquet floral Sea Glass en la esquina superior izquierda */}
          <div className="boho-top-floral-wrap" aria-hidden="true">
            <img src={seaGlassTopLeft} alt="" className="boho-corner-img" />
          </div>

          {/* Versículo bíblico / Cita de amor dinámica */}
          {invitation.showWelcome !== false && (
            <section className="boho-quote-section">
              <p className="boho-verse-text">
                &ldquo;{invitation.welcomeMessage || 'Y sobre todas estas cosas, vístanse de amor, que es el vínculo perfecto.'}&rdquo;
              </p>
              {invitation.welcomeCitation ? (
                <p className="boho-verse-cite">{invitation.welcomeCitation}</p>
              ) : !invitation.welcomeMessage ? (
                <p className="boho-verse-cite">Colosenses 3:14</p>
              ) : null}
            </section>
          )}

          {/* Monograma con iniciales o Logo personalizado subido por los novios */}
          <section className="boho-monogram-section">
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
            <p className="boho-we-marry-text">¡NOS CASAMOS!</p>
          </section>

          {/* Reproductor de música inline con diseño fiel al requerimiento */}
          {audio && (
            <WeddingMusicPlayer
              audio={audio}
              musicOn={musicOn}
              toggleMusic={toggleMusic}
            />
          )}

          {/* Foto Principal (Hero) con efecto de papel rasgado / torn paper edge */}
          {mainPhoto && (
            <section className="boho-deckle-photo-wrap">
              <div className="boho-torn-paper-frame">
                <img src={getImageUrl(mainPhoto.imageUrl)} alt={mainPhoto.caption || 'Nuestra boda'} className="boho-torn-img" />
              </div>
            </section>
          )}

          {/* Bendición de los padres y padrinos */}
          {hasFamilyBlessing && (
            <section className="boho-parents-section">
              <p className="boho-parents-lead">
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

          {/* Sección Nosotros: Nombres caligráficos y ramillete lateral Sea Glass */}
          <section className="boho-couple-hero-section">
            <p className="boho-nosotros-label">Nosotros</p>
            <div className="boho-names-flow-wrap">
              <img src={seaGlassDividerCluster} alt="" className="boho-names-side-cluster cluster-left" aria-hidden="true" />
              <h1 className="boho-script-couple">
                <span className="script-partner">{invitation.partnerOneName}</span>
                <span className="script-amp">&amp;</span>
                <span className="script-partner">{invitation.partnerTwoName}</span>
              </h1>
              <img src={seaGlassDividerCluster} alt="" className="boho-names-side-cluster cluster-right" aria-hidden="true" />
            </div>
            <p className="boho-honor-invitation-text">
              Tenemos el honor de invitarte a celebrar nuestra unión en matrimonio
            </p>
          </section>

          {/* Tarjeta de Fecha Minimalista */}
          <section className="boho-date-card-section">
            <div className="boho-date-minimal-card">
              <span className="date-month-title">
                {invitation.weddingDate ? new Intl.DateTimeFormat('es-PE', { month: 'long' }).format(new Date(`${invitation.weddingDate}T00:00:00`)).toUpperCase() : 'FECHA'}
              </span>
              <div className="date-numbers-row">
                <span className="date-weekday">
                  {invitation.weddingDate ? new Intl.DateTimeFormat('es-PE', { weekday: 'long' }).format(new Date(`${invitation.weddingDate}T00:00:00`)).toUpperCase() : 'DÍA'}
                </span>
                <span className="date-day-big">
                  {invitation.weddingDate ? new Date(`${invitation.weddingDate}T00:00:00`).getDate() : '20'}
                </span>
                <span className="date-year">
                  {invitation.weddingDate ? new Date(`${invitation.weddingDate}T00:00:00`).getFullYear() : '2026'}
                </span>
              </div>
            </div>
          </section>

          {/* Contador Regresivo Minimalista: FALTAN 21 : 19 : 14 : 27 */}
          <section className="boho-countdown-section">
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
          </section>

          {/* Separador floral Sea Glass y Segunda Foto Rasgada */}
          <div className="boho-section-floral-divider" aria-hidden="true">
            <img src={seaGlassDividerCluster} alt="" />
          </div>

          {secondPhoto && (
            <div className="boho-deckle-photo-wrap">
              <div className="boho-torn-paper-frame">
                <img src={getImageUrl(secondPhoto.imageUrl)} alt={secondPhoto.caption || 'Momentos de amor'} className="boho-torn-img" />
              </div>
            </div>
          )}

          {/* Ubicación y Horario (Ceremonia y Recepción) */}
          <section className="boho-venues-section">
            {ceremonyLocation && (
              <article className="boho-venue-card">
                <div className="venue-card-icon" aria-hidden="true">
                  <ActivityIcon title="Ceremonia" />
                </div>
                <h3 className="boho-venue-title">CEREMONIA</h3>
                <p className="boho-venue-time">{ceremonyTime} HRS</p>
                <h4 className="boho-venue-place">{ceremonyLocation.name}</h4>
                <p className="boho-venue-addr">{ceremonyLocation.address || visibleAddress}</p>
                <button
                  type="button"
                  className="boho-terracotta-btn"
                  onClick={() => openMap(ceremonyLocation.mapUrl || mapExternalUrl)}
                >
                  Ver ubicación
                </button>
              </article>
            )}

            <article className="boho-venue-card">
              <div className="venue-card-icon" aria-hidden="true">
                <ActivityIcon title="Recepción" />
              </div>
              <h3 className="boho-venue-title">RECEPCIÓN</h3>
              <p className="boho-venue-time">{receptionTime} HRS</p>
              <h4 className="boho-venue-place">{receptionLocation?.name || invitation.venueName}</h4>
              <p className="boho-venue-addr">{receptionLocation?.address || visibleAddress}</p>
              {(receptionLocation?.mapUrl || mapExternalUrl) && (
                <button
                  type="button"
                  className="boho-terracotta-btn"
                  onClick={() => openMap(receptionLocation?.mapUrl || mapExternalUrl)}
                >
                  Ver ubicación
                </button>
              )}
            </article>
          </section>

          {/* AGENDA DE ACTIVIDADES: Solo se muestran los ítems configurados en el panel de novios */}
          {invitation.showSchedule !== false && schedule.length > 0 && (
            <section className="boho-itinerary-section">
              <h2 className="boho-itinerary-heading">AGENDA DE ACTIVIDADES</h2>
              <div className="boho-timeline-vertical">
                {schedule.map((item, idx) => (
                  <div className="boho-timeline-node" key={`${item.title}-${idx}`}>
                    <div className="node-icon-wrap" aria-hidden="true">
                      <ActivityIcon title={item.title} notes={item.notes} />
                    </div>
                    <div className="node-info">
                      <strong className="node-title">{item.title}</strong>
                      <span className="node-time">{item.time} HRS</span>
                      {item.notes && <p className="node-notes">{item.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tercera Foto Rasgada */}
          {thirdPhoto && (
            <div className="boho-deckle-photo-wrap">
              <div className="boho-torn-paper-frame">
                <img src={getImageUrl(thirdPhoto.imageUrl)} alt={thirdPhoto.caption || 'Nuestra historia'} className="boho-torn-img" />
              </div>
            </div>
          )}

          {/* Código de Vestimenta: Imagen oficial de novios o ilustración formal en blanco y negro */}
          {invitation.showDressCode !== false && (
            <section className="boho-dresscode-section">
              <h2 className="boho-dresscode-heading">CÓDIGO DE VESTIMENTA</h2>
              <p className="boho-dresscode-subtitle">{invitation.dressCode || 'Formal'}</p>

              <div className="dresscode-illustration-wrapper">
                <img
                  src={invitation.dressCodeImageUrl ? getImageUrl(invitation.dressCodeImageUrl) : '/illustrations/dress-code-formal.png'}
                  alt="Código de vestimenta"
                  className="dresscode-illustration-image"
                />
              </div>

              {invitation.showDressCodePalette && dressCodePalette.length > 0 && (
                <div className="boho-palette-row" aria-label="Colores sugeridos">
                  {dressCodePalette.map((col, idx) => {
                    const colorVal = typeof col === 'string' ? col : col.hex
                    const labelVal = typeof col === 'object' ? col.label : ''
                    return (
                      <div className="palette-circle-col" key={idx}>
                        <div
                          className="boho-palette-circle"
                          style={{ backgroundColor: colorVal }}
                          title={labelVal || colorVal}
                        />
                        {labelVal && <span className="dress-code-color-name">{labelVal}</span>}
                      </div>
                    )
                  })}
                </div>
              )}

              <p className="boho-dresscode-note">
                Con mucho cariño les pedimos evitar prendas en color blanco y beige.
              </p>
            </section>
          )}

          {/* Sugerencia de Regalos */}
          {invitation.showGiftRegistry !== false && (
            <section className="boho-gifts-section">
              <div className="boho-gift-icon" aria-hidden="true">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="8" width="18" height="13" rx="2" />
                  <line x1="12" y1="8" x2="12" y2="21" />
                  <path d="M12 8H7.5a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8z" />
                </svg>
              </div>
              <h2 className="boho-gifts-heading">SUGERENCIA DE REGALOS</h2>
              <p className="boho-gifts-lead">
                El mejor regalo es tu presencia, pero si deseas tener un detalle con nosotros, les dejamos estas opciones:
              </p>

              <div className="boho-gift-cards-stack">
                <div className="boho-gift-card">
                  <p className="boho-gift-tag">LLUVIA DE SOBRES</p>
                  <p className="boho-gift-info">
                    Dispondremos de un buzón en la recepción para compartirnos tu detalle en sobre.
                  </p>
                </div>

                {giftOptions.length > 0 && (
                  <div className="boho-gift-card">
                    <p className="boho-gift-tag">TRANSFERENCIA</p>
                    {giftOptions.map((opt, i) => (
                      <div className="boho-bank-row" key={i}>
                        <div className="bank-meta">
                          <strong>{opt.title || opt.type}</strong>
                          <span>{opt.details}</span>
                        </div>
                        {opt.details && (
                          <button
                            type="button"
                            className="boho-copy-btn"
                            onClick={() => copyText(opt.details)}
                          >
                            {copiedAccount ? '¡Copiado!' : 'Copiar datos'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Confirmar Asistencia (RSVP) */}
          <section className="boho-rsvp-section">
            <div className="boho-rsvp-icon" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="M12 14c-1.5-1.5-3 .5-1.5 2l1.5 1.5 1.5-1.5c1.5-1.5 0-3.5-1.5-2z" />
              </svg>
            </div>
            <h2 className="boho-rsvp-heading">CONFIRMAR ASISTENCIA</h2>
            <p className="boho-rsvp-lead">
              Agradecemos que confirmes tu asistencia con anticipación.
            </p>

            {rsvp ? (
              <form className="boho-rsvp-form" onSubmit={handleSubmit}>
                <div className="boho-reservation-status">
                  Tienes <strong>{rsvp.maxGuestsAllowed}</strong> {rsvp.maxGuestsAllowed === 1 ? 'pase reservado' : 'pases reservados'}
                  {confirmedCount > 0 && <span> ({confirmedCount} confirmados)</span>}
                </div>

                <label className="boho-form-field">
                  <span>¿Cuántas personas asistirán?</span>
                  <select
                    value={attendeesCount}
                    onChange={(e) => changeAttendeesCount(e.target.value)}
                    required
                  >
                    <option value="" disabled>Selecciona una cantidad</option>
                    {Array.from({ length: rsvp.maxGuestsAllowed }, (_, i) => i + 1).map((qty) => (
                      <option value={qty} key={qty}>{qty} {qty === 1 ? 'persona' : 'personas'}</option>
                    ))}
                  </select>
                </label>

                {guests.map((guest, index) => (
                  <div className="boho-guest-field" key={`${guest.id || 'new'}-${index}`}>
                    <label className="boho-form-field">
                      <span>Nombre completo del invitado {index + 1}</span>
                      <input
                        value={guest.fullName}
                        onChange={(e) => updateGuest(index, 'fullName', e.target.value)}
                        placeholder="Nombre y apellido"
                        required
                      />
                    </label>
                  </div>
                ))}

                <label className="boho-form-field">
                  <span>Mensaje para los novios</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Dedícanos unas palabras especiales..."
                    rows="3"
                  />
                </label>

                {error && <p className="boho-form-error">{error}</p>}
                {success && <p className="boho-form-success">{success}</p>}

                <button type="submit" className="boho-submit-btn" disabled={saving}>
                  {saving ? 'Guardando...' : 'Confirmar Asistencia'}
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
              <p className="boho-rsvp-lead" style={{ fontStyle: 'italic' }}>
                La confirmación se realiza mediante el enlace personalizado enviado a cada familia.
              </p>
            )}
          </section>

          {/* Despedida y agradecimiento */}
          <section className="boho-farewell-section">
            <p className="boho-farewell-eyebrow">ESPERAMOS CONTAR CON SU PRESENCIA</p>
            <h2 className="boho-thankyou-script">¡Muchas Gracias!</h2>
            <div className="boho-bottom-cluster" aria-hidden="true">
              <img src={seaGlassBouquet} alt="" />
            </div>
          </section>

          {/* Foto final si existe */}
          {footerPhoto && (
            <div className="boho-deckle-photo-wrap" style={{ marginTop: '20px' }}>
              <div className="boho-torn-paper-frame">
                <img src={getImageUrl(footerPhoto.imageUrl)} alt={footerPhoto.caption || 'Foto de despedida'} className="boho-torn-img" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
