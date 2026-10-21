import React from 'react'
import { getImageUrl } from '../services/api'
import { WeddingMusicPlayer } from './WeddingMusicPlayer'
import { ActivityIcon } from './ActivityIcon'

const coverReferenceImage = '/illustrations/cover-envelope-reference.png'
const seaGlassTopLeft = '/illustrations/seaglass-corner-top-left.png'
const seaGlassBottomRight = '/illustrations/seaglass-corner-bottom-right.png'
const seaGlassDividerCluster = '/illustrations/seaglass-divider-cluster.png'
const seaGlassBouquet = '/illustrations/seaglass-bouquet.png'
const seaGlassVertical = '/illustrations/seaglass-vertical.png'

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

  return (
    <div className="floral-romance-template">
      {/* 1. PORTADA CON FLORES SEA GLASS Y ESPACIADOS REFINADOS */}
      {!isOpened && (
        <div className={`invitation-cover ${isOpening ? 'is-opening' : ''}`}>
          <img className="cover-floral-image cover-floral-tl" src={seaGlassTopLeft} alt="" aria-hidden="true" />
          <img className="cover-floral-image cover-floral-br" src={seaGlassBottomRight} alt="" aria-hidden="true" />
          <img className="cover-floral-image cover-floral-vertical" src={seaGlassVertical} alt="" aria-hidden="true" />
          <img className="cover-floral-image cover-floral-bottom" src={seaGlassBouquet} alt="" aria-hidden="true" />

          <div className="invitation-cover-content">
            <p className="eyebrow cover-eyebrow-higher">Nuestra boda</p>
            <h1 className="cover-couple">
              <span className="cover-name">{invitation.partnerOneName}</span>
              <span className="cover-ampersand">&amp;</span>
              <span className="cover-name">{invitation.partnerTwoName}</span>
            </h1>
            <p className="cover-date">{formatDate(invitation.weddingDate)}</p>

            <button className="envelope-visual" type="button" onClick={openInvitation} disabled={isOpening} aria-label="Abrir invitación">
              <span className="envelope-image-wrap">
                <img className="envelope-reference-image" src={coverReferenceImage} alt="Sobre de la invitación" />
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

      {/* 2. INVITACIÓN ABIERTA */}
      <div className={`floral-body-container ${!isOpened ? 'invitation-body-hidden' : ''}`}>
        {audio && (
          <audio id="wedding-audio" src={getImageUrl(audio.audioUrl)} loop />
        )}

        <section className="invitation-hero personalized-hero">
          {rsvp && <p className="eyebrow">Invitación para {rsvp.contactName}</p>}
          <h1>{invitation.partnerOneName} <span>&amp;</span> {invitation.partnerTwoName}</h1>
          <p className="invitation-title">{invitation.title}</p>
          <p className="wedding-date">{formatDate(invitation.weddingDate)}</p>

          {/* Contador minimalista unificado */}
          <div className="boho-countdown-section" style={{ margin: '20px 0' }}>
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

          <div className="hero-divider" aria-hidden="true">✦</div>

          {/* Mensaje de bienvenida y cita dinámica */}
          {invitation.showWelcome !== false && (
            <div className="welcome-block-floral">
              <p className="welcome-text">{invitation.welcomeMessage || 'Nos encantará celebrar este día contigo.'}</p>
              {invitation.welcomeCitation && (
                <p className="boho-verse-cite" style={{ textAlign: 'center', marginTop: '6px' }}>
                  {invitation.welcomeCitation}
                </p>
              )}
            </div>
          )}

          {/* Logo o Monograma */}
          <div className="boho-monogram-section" style={{ margin: '12px 0 16px' }}>
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

          {/* Reproductor de música inline fiel a la referencia */}
          {audio && (
            <WeddingMusicPlayer
              audio={audio}
              musicOn={musicOn}
              toggleMusic={toggleMusic}
            />
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

        {/* BENDICIÓN DE PADRES Y PADRINOS */}
        {hasFamilyBlessing && (
          <section className="content-section parents-blessing-section">
            <p className="eyebrow">Nuestras Familias</p>
            <p className="boho-parents-lead" style={{ textAlign: 'center', marginBottom: '16px' }}>
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

        {/* UBICACIONES */}
        {invitation.showLocation !== false && (
          <section className="details-section">
            <p className="eyebrow">Celebración</p>
            {locations.length > 0 ? (
              <div className="location-list">
                {locations.map((location, index) => (
                  <article className="location-card" key={`${location.type}-${index}`}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                      <ActivityIcon title={location.type || 'Evento'} />
                    </div>
                    <p className="eyebrow">{location.type || 'Evento'}</p>
                    <h3>{location.name || 'Lugar por confirmar'}</h3>
                    <p className="muted-text">{location.address || visibleAddress}</p>
                    {location.mapUrl && (
                      <button type="button" className="secondary-button" onClick={() => openMap(location.mapUrl)}>
                        Ver mapa
                      </button>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div>
                <h2>{invitation.venueName || 'Lugar por confirmar'}</h2>
                <p className="muted-text">{invitation.venueAddress || visibleAddress || 'Dirección por confirmar'}</p>
                {mapExternalUrl && (
                  <button type="button" className="secondary-button" onClick={() => openMap(mapExternalUrl)}>
                    Abrir en Google Maps
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {/* HISTORIA */}
        {invitation.showStory !== false && invitation.storyText && (
          <section className="content-section">
            <p className="eyebrow">Nuestra Historia</p>
            <h2>Un camino juntos</h2>
            <p className="story-text">{invitation.storyText}</p>
            {storyPhotos.length > 0 && (
              <div className="story-gallery">
                {storyPhotos.map((photo) => (
                  <img key={photo.id} src={getImageUrl(photo.imageUrl)} alt={photo.caption || 'Historia de los novios'} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* AGENDA DE ACTIVIDADES: Solo se muestran los ítems configurados en el panel de novios */}
        {invitation.showSchedule !== false && schedule.length > 0 && (
          <section className="content-section">
            <p className="eyebrow">Agenda de actividades</p>
            <h2>AGENDA DE ACTIVIDADES</h2>
            <div className="schedule-list">
              {schedule.map((item, index) => (
                <article key={`${item.title}-${index}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ActivityIcon title={item.title} notes={item.notes} />
                    <strong>{item.time || item.startsAt || ''} HRS</strong>
                  </div>
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

        {/* CÓDIGO DE VESTIMENTA */}
        {invitation.showDressCode !== false && (
          <section className="content-section dress-code-section">
            <p className="eyebrow">Vestimenta</p>
            <h2>Código de vestimenta</h2>

            <div className="dresscode-illustration-wrapper">
              <img
                src={invitation.dressCodeImageUrl ? getImageUrl(invitation.dressCodeImageUrl) : '/illustrations/dress-code-formal.png'}
                alt="Código de vestimenta"
                className="dresscode-illustration-image"
              />
            </div>

            <p className="dress-code-label">{invitation.dressCode || 'Formal'}</p>

            {invitation.showDressCodePalette && dressCodePalette.length > 0 && (
              <div className="dress-code-palette-block" style={{ marginTop: '16px' }}>
                <p className="palette-label" style={{ fontSize: '0.78rem', letterSpacing: '0.12em', color: '#666', marginBottom: '8px' }}>PALETA DE COLORES SUGERIDA</p>
                <div className="palette-swatches-row" style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {dressCodePalette.map((color, i) => (
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

        {/* REGALOS */}
        {invitation.showGiftRegistry !== false && (giftOptions.length > 0 || invitation.giftRegistryUrl) && (
          <section className="content-section gift-section">
            <p className="eyebrow">Regalos</p>
            <h2>Un detalle para nosotros</h2>
            {giftOptions.length > 0 ? (
              <div className="gift-list">
                {giftOptions.map((gift, index) => (
                  <article className="gift-card" key={`${gift.title}-${index}`}>
                    <p className="eyebrow">{gift.type || 'Mesa de regalos'}</p>
                    <h3>{gift.title || 'Detalle'}</h3>
                    <p className="muted-text">{gift.details || 'Gracias por tu cariño.'}</p>
                    {gift.url && (
                      <button type="button" className="secondary-button" onClick={() => openMap(gift.url)}>
                        Ver enlace
                      </button>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="gift-registry">
                <p>El mejor regalo es tu presencia. Si deseas hacernos un presente, puedes consultar nuestra mesa de regalos.</p>
                {invitation.giftRegistryUrl && (
                  <button type="button" className="primary-button" onClick={() => openMap(invitation.giftRegistryUrl)}>
                    Ver mesa de regalos
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {/* PREGUNTAS FRECUENTES */}
        {invitation.showFaq !== false && faqs.length > 0 && (
          <section className="content-section faq-section">
            <p className="eyebrow">Dudas frecuentes</p>
            <h2>Preguntas frecuentes</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <details key={`${faq.question}-${index}`}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* MESAS */}
        {invitation.showTables !== false && tables.length > 0 && (
          <section className="content-section tables-section">
            <p className="eyebrow">Recepción</p>
            <h2>Distribución de mesas</h2>
            <div className="table-list">
              {tables.map((table, index) => (
                <article key={`${table.name}-${index}`}>
                  <h3>{table.name || `Mesa ${index + 1}`}</h3>
                  <p>{table.capacity ? `Capacidad: ${table.capacity} personas` : ''}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* GALERÍA */}
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

        {/* CONFIRMACIÓN RSVP */}
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
                    <input value={guest.fullName} onChange={(event) => updateGuest(index, 'fullName', event.target.value)} required />
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

              {/* Botón de Pase de Acceso elegante y destacado */}
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
          </section>
        )}

        {/* FOTO DE CIERRE */}
        {footerPhoto && (
          <section className="footer-photo-section" style={{ textAlign: 'center', marginTop: '30px' }}>
            <img src={getImageUrl(footerPhoto.imageUrl)} alt={footerPhoto.caption || 'Cierre'} style={{ maxWidth: '100%', borderRadius: '16px' }} />
          </section>
        )}
      </div>
    </div>
  )
}
