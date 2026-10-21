import React from 'react'

export function ActivityIcon({ title = '', notes = '', className = 'activity-svg-icon' }) {
  const text = `${title} ${notes}`.toLowerCase()

  if (/ceremonia|misa|iglesia|templo|religioso|capilla/i.test(text)) {
    // Iglesia / Capilla
    return (
      <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M10 4h4" />
        <path d="M4 22V9l8-5 8 5v13H4z" />
        <path d="M10 22v-6h4v6" />
        <circle cx="12" cy="11" r="1.5" />
      </svg>
    )
  }

  if (/civil|anillos|votos/i.test(text)) {
    // Anillos entrelazados
    return (
      <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="12" r="5" />
        <circle cx="15" cy="12" r="5" />
        <path d="M9 7l1-2 2 1" />
      </svg>
    )
  }

  if (/brindis|copas|champagne|brindar/i.test(text)) {
    // Copas de brindis
    return (
      <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3v5a3 3 0 0 0 6 0V3H8z" />
        <path d="M11 13v6M8 19h6" />
        <path d="M16 6l3-3M5 3l3 3" />
      </svg>
    )
  }

  if (/banquete|cena|comida|almuerzo|degustaci[oó]n|buffet/i.test(text)) {
    // Cubiertos y plato
    return (
      <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 8v8M7 8h2M16 8v8M15 8c0 2 2 2 2 0" />
      </svg>
    )
  }

  if (/tarta|pastel|torta|postre/i.test(text)) {
    // Torta de bodas
    return (
      <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 21h14v-5H5v5zM7 16V11h10v5M9 11V7h6v4" />
        <circle cx="12" cy="4" r="1" />
      </svg>
    )
  }

  if (/baile|vals|entrada/i.test(text)) {
    // Vals / Danza / Entrada de novios
    return (
      <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="6" r="2.5" />
        <circle cx="16" cy="6" r="2.5" />
        <path d="M5 21l3-7 4 3 4-7 3 11" />
      </svg>
    )
  }

  if (/fiesta|m[uú]sica|dj|orquesta|celebraci[oó]n|hora loca/i.test(text)) {
    // Notas musicales y fiesta
    return (
      <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    )
  }

  if (/foto|sesi[oó]n|fotograf/i.test(text)) {
    // Cámara fotográfica
    return (
      <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    )
  }

  if (/recepci[oó]n|bienvenida|coctel/i.test(text)) {
    // Recepción / Entrada al salón
    return (
      <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
      </svg>
    )
  }

  // Fallback: Elegante estrella / destello
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 5.2L20 8l-4 3.8L17 18l-5-2.8L7 18l1-6.2L4 8l5.6-.8L12 2z" />
    </svg>
  )
}
