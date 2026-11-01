import React from 'react'

const luxurySealImg = '/illustrations/luxury-seal-transparent.png'

export function AnimatedWeddingEnvelope({
  isOpening,
  onOpen,
  partnerOneName,
  partnerTwoName,
  weddingDate,
  envelopeMonogram,
  formatDate,
}) {
  const formattedDate = weddingDate && formatDate ? formatDate(weddingDate) : '24 de Julio de 2027'

  return (
    <button
      className={`envelope-visual ${isOpening ? 'is-opening' : ''}`}
      type="button"
      onClick={onOpen}
      disabled={isOpening}
      aria-label="Abrir invitación"
    >
      <span className="envelope-3d-stage">
        {/* Layer 1: Base interior del sobre con forro champagne satinado (Z: 0px) */}
        <span className="envelope-back-wall" aria-hidden="true">
          <span className="envelope-lining" />
        </span>

        {/* Layer 2: Tarjeta interior de papelería nupcial (Z: 2px) */}
        <span className="envelope-inner-card">
          <span className="envelope-inner-card-border" aria-hidden="true" />
          <span className="envelope-card-content">
            <span className="envelope-card-crest" aria-hidden="true">❦</span>
            <span className="envelope-card-header">NUESTRA BODA</span>
            <span className="envelope-card-couple">
              <span className="envelope-card-name">{partnerOneName}</span>
              <span className="envelope-card-amp">&amp;</span>
              <span className="envelope-card-name">{partnerTwoName}</span>
            </span>
            <span className="envelope-card-date">{formattedDate}</span>
          </span>
        </span>

        {/* Layer 3: Bolsillo frontal artesanal con pliegues nítidos (Z: 4px) */}
        <span className="envelope-front-pocket" aria-hidden="true">
          <span className="pocket-crease-left" />
          <span className="pocket-crease-right" />
          <span className="pocket-crease-bottom" />
        </span>

        {/* Layer 4: Solapa 3D abatible (Z: 6px cerrado -> Z: -1px abierto detrás del sobre) */}
        <span className="envelope-flap-3d">
          <span className="envelope-flap-front">
            <span className="envelope-flap-monogram" aria-hidden="true">{envelopeMonogram}</span>
          </span>
          <span className="envelope-flap-back" aria-hidden="true" />
        </span>

        {/* Layer 5: Sello de lacre dorado artesanal (Z: 8px) */}
        <span className="envelope-wax-seal" aria-hidden="true">
          <img src={luxurySealImg} alt="Sello de lacre" />
        </span>
      </span>

      <span className="envelope-open-label">
        {isOpening ? 'Abriendo invitación...' : 'Dar click para abrir'}
      </span>
    </button>
  )
}
