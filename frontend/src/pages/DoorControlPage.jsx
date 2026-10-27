import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDoorAccessData, toggleDoorCheckInPublic } from '../services/api'
import {
  IconShieldCheck,
  IconSearch,
  IconCheck,
  IconClock,
  IconTable,
  IconUsers,
  IconRefresh,
  IconCheckCircle,
  IconAlertTriangle,
} from '../components/ReportIcons'

export default function DoorControlPage() {
  const { slug, doorKey } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterMode, setFilterMode] = useState('ALL') // 'ALL' | 'PENDING' | 'CHECKED_IN'
  const [sortBy, setSortBy] = useState('NAME') // 'NAME' | 'TABLE'
  const [updatingId, setUpdatingId] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    loadDoorData()
  }, [slug, doorKey])

  async function loadDoorData(isSilent = false) {
    if (!isSilent) setLoading(true)
    setError('')
    try {
      const res = await getDoorAccessData(slug, doorKey)
      setData(res)
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Acceso denegado. La clave de seguridad del enlace no es válida.')
      } else if (err.response?.status === 404) {
        setError('No se encontró la boda asociada a este enlace.')
      } else {
        setError('Ocurrió un error al cargar el control de acceso. Por favor intenta de nuevo.')
      }
    } finally {
      if (!isSilent) setLoading(false)
    }
  }

  function showToast(msg) {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage('')
    }, 2800)
  }

  async function handleToggle(item) {
    if (!data) return
    const currentChecked = Boolean(item.checkedIn)
    const targetChecked = !currentChecked
    const targetNow = targetChecked ? new Date().toISOString() : null

    // Optimistic update
    setData((prev) => {
      if (!prev) return prev
      const nextGuests = prev.guests.map((g) => {
        if (g.id === item.id) {
          return {
            ...g,
            checkedIn: targetChecked,
            checkedInAt: targetNow,
          }
        }
        return g
      })
      return { ...prev, guests: nextGuests }
    })

    setUpdatingId(item.id)
    try {
      await toggleDoorCheckInPublic(slug, doorKey, {
        guestId: item.guestId,
        groupId: item.groupId,
        checkedIn: targetChecked,
      })
      showToast(targetChecked ? `✓ Ingreso registrado: ${item.guestName}` : `Ingreso deshecho: ${item.guestName}`)
    } catch {
      // Revert on failure
      setData((prev) => {
        if (!prev) return prev
        const nextGuests = prev.guests.map((g) => {
          if (g.id === item.id) {
            return {
              ...g,
              checkedIn: currentChecked,
              checkedInAt: item.checkedInAt,
            }
          }
          return g
        })
        return { ...prev, guests: nextGuests }
      })
      alert('Error de conexión al registrar el ingreso. Inténtalo nuevamente.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Parse tables JSON to map guest -> table name
  const tableMap = useMemo(() => {
    if (!data?.tablesJson) return {}
    try {
      const parsed = JSON.parse(data.tablesJson)
      if (!Array.isArray(parsed)) return {}
      const map = {}
      parsed.forEach((t, idx) => {
        const name = t.name || `Mesa ${idx + 1}`
        if (Array.isArray(t.guestIds)) {
          t.guestIds.forEach((gid) => {
            map[String(gid)] = name
          })
        }
      })
      return map
    } catch {
      return {}
    }
  }, [data?.tablesJson])

  // Decorated guest list with table names
  const decoratedGuests = useMemo(() => {
    if (!data?.guests) return []
    return data.guests.map((g) => {
      const tableName = g.guestId ? tableMap[String(g.guestId)] : null
      return {
        ...g,
        tableName: tableName || null,
      }
    })
  }, [data?.guests, tableMap])

  // Filtered & sorted guests
  const filteredGuests = useMemo(() => {
    let list = [...decoratedGuests]

    // Status filter
    if (filterMode === 'PENDING') {
      list = list.filter((g) => !g.checkedIn)
    } else if (filterMode === 'CHECKED_IN') {
      list = list.filter((g) => Boolean(g.checkedIn))
    }

    // Search query
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((g) => {
        const nameMatch = (g.guestName || '').toLowerCase().includes(q)
        const groupMatch = (g.groupName || '').toLowerCase().includes(q)
        const tableMatch = (g.tableName || '').toLowerCase().includes(q)
        return nameMatch || groupMatch || tableMatch
      })
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'TABLE') {
        const tA = a.tableName || 'ZZZ'
        const tB = b.tableName || 'ZZZ'
        if (tA !== tB) return tA.localeCompare(tB)
      }
      return (a.guestName || '').localeCompare(b.guestName || '', 'es', { sensitivity: 'base' })
    })

    return list
  }, [decoratedGuests, filterMode, search, sortBy])

  // Counts
  const totalGuests = decoratedGuests.length
  const checkedInCount = decoratedGuests.filter((g) => Boolean(g.checkedIn)).length
  const pendingCount = totalGuests - checkedInCount
  const progressPct = totalGuests > 0 ? Math.round((checkedInCount / totalGuests) * 100) : 0

  if (loading) {
    return (
      <div className="door-loading-screen">
        <div className="door-spinner" />
        <h2>Cargando lista de acceso...</h2>
        <p>Verificando credenciales de puerta</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="door-error-screen">
        <div className="door-error-card">
          <IconAlertTriangle size={48} color="#c53030" />
          <h2>Acceso No Autorizado</h2>
          <p>{error}</p>
          <div className="door-error-actions">
            <button type="button" className="primary-button" onClick={() => loadDoorData()}>
              Reintentar
            </button>
            <Link to="/" className="secondary-button">
              Ir al Inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="door-control-wrapper">
      {/* HEADER PRINCIPAL */}
      <header className="door-header">
        <div className="door-header-top">
          <div className="door-badge-pill">
            <IconShieldCheck size={16} />
            <span>Control Oficial de Ingreso</span>
          </div>
          <button
            type="button"
            className="door-refresh-btn"
            onClick={() => loadDoorData(true)}
            title="Actualizar lista en tiempo real"
          >
            <IconRefresh size={16} />
            <span>Actualizar</span>
          </button>
        </div>

        <div className="door-wedding-info">
          <h1>{data.weddingTitle || `${data.partnerOneName} & ${data.partnerTwoName}`}</h1>
          <p className="door-wedding-names">
            {data.partnerOneName} &amp; {data.partnerTwoName}
            {data.weddingDate && ` · ${data.weddingDate}`}
          </p>
        </div>

        {/* CONTADORES KPI */}
        <div className="door-kpi-bar">
          <div className="door-kpi-item kpi-total">
            <span className="door-kpi-num">{totalGuests}</span>
            <span className="door-kpi-text">Total Invitados</span>
          </div>
          <div className="door-kpi-item kpi-entered">
            <span className="door-kpi-num">{checkedInCount}</span>
            <span className="door-kpi-text">Ingresaron</span>
          </div>
          <div className="door-kpi-item kpi-pending">
            <span className="door-kpi-num">{pendingCount}</span>
            <span className="door-kpi-text">Por Ingresar</span>
          </div>
        </div>

        {/* BARRA DE PROGRESO */}
        <div className="door-progress-container">
          <div className="door-progress-track">
            <div className="door-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="door-progress-pct">{progressPct}% de aforo</span>
        </div>
      </header>

      {/* TOAST FLOTANTE */}
      {toastMessage && (
        <div className="door-toast" role="status">
          {toastMessage}
        </div>
      )}

      {/* TOOLBAR: BÚSQUEDA Y FILTROS */}
      <section className="door-toolbar">
        <div className="door-search-box">
          <IconSearch size={18} className="door-search-icon" />
          <input
            type="text"
            placeholder="Buscar por invitado, familia o mesa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" className="door-clear-search" onClick={() => setSearch('')}>
              ✕
            </button>
          )}
        </div>

        <div className="door-filter-row">
          <div className="door-filter-tabs">
            <button
              type="button"
              className={`door-tab-pill ${filterMode === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterMode('ALL')}
            >
              Todos ({totalGuests})
            </button>
            <button
              type="button"
              className={`door-tab-pill ${filterMode === 'PENDING' ? 'active' : ''}`}
              onClick={() => setFilterMode('PENDING')}
            >
              Por ingresar ({pendingCount})
            </button>
            <button
              type="button"
              className={`door-tab-pill ${filterMode === 'CHECKED_IN' ? 'active' : ''}`}
              onClick={() => setFilterMode('CHECKED_IN')}
            >
              Ingresaron ({checkedInCount})
            </button>
          </div>

          <div className="door-sort-select">
            <label htmlFor="door-sort">Ordenar:</label>
            <select
              id="door-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="NAME">Por Nombre (A-Z)</option>
              <option value="TABLE">Por Mesa Asignada</option>
            </select>
          </div>
        </div>
      </section>

      {/* LISTA DE INVITADOS */}
      <main className="door-guest-list">
        {filteredGuests.map((item) => {
          const isChecked = Boolean(item.checkedIn)
          const isUpdating = updatingId === item.id

          return (
            <article
              key={item.id}
              className={`door-guest-card ${isChecked ? 'is-checked-in' : 'is-pending'}`}
            >
              <div className="door-card-left">
                <div className="door-guest-main">
                  <h3 className="door-guest-name">
                    {item.guestName}
                    {item.isHolderOnly && <span className="door-holder-tag">Titular</span>}
                  </h3>
                  <div className="door-guest-details">
                    <span className="door-group-tag">
                      <IconUsers size={13} />
                      {item.groupName}
                    </span>
                    {item.tableName ? (
                      <span className="door-table-tag">
                        <IconTable size={13} />
                        {item.tableName}
                      </span>
                    ) : (
                      <span className="door-table-tag tag-none">Sin mesa</span>
                    )}
                    {item.status === 'CONFIRMED' && (
                      <span className="door-rsvp-tag tag-confirmed">
                        <IconCheck size={12} /> Confirmado
                      </span>
                    )}
                    {item.status === 'PENDING' && (
                      <span className="door-rsvp-tag tag-pending">
                        <IconClock size={12} /> Pendiente
                      </span>
                    )}
                  </div>
                </div>

                {isChecked && item.checkedInAt && (
                  <div className="door-time-badge">
                    <IconCheckCircle size={13} color="#2e7d32" />
                    <span>
                      Ingresó a las{' '}
                      {new Date(item.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>

              <div className="door-card-right">
                {isChecked ? (
                  <div className="door-actions-group">
                    <div className="door-badge-checked">
                      <IconCheck size={18} />
                      <span>Ingresó</span>
                    </div>
                    <button
                      type="button"
                      className="door-undo-btn"
                      onClick={() => handleToggle(item)}
                      disabled={isUpdating}
                      title="Deshacer ingreso"
                    >
                      Deshacer
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="door-checkin-btn"
                    onClick={() => handleToggle(item)}
                    disabled={isUpdating}
                  >
                    <IconCheck size={18} />
                    <span>{isUpdating ? 'Marcando...' : 'Marcar Ingreso'}</span>
                  </button>
                )}
              </div>
            </article>
          )
        })}

        {filteredGuests.length === 0 && (
          <div className="door-empty-state">
            <p>No se encontraron invitados con los filtros aplicados.</p>
            {search && (
              <button type="button" className="door-clear-search-btn" onClick={() => setSearch('')}>
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </main>

      {/* FOOTER DEL CONTROL DE ACCESO */}
      <footer className="door-footer">
        <p>Sistema de Control de Ingreso y Recepción · Boda Web</p>
      </footer>
    </div>
  )
}
