
import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const emptyForm = {
  title: '',
  description: '',
  category: 'Redes',
  priority: 'MEDIA',
  reported_by: '',
  assigned_to: '',
}

export default function App() {
  const [incidents, setIncidents] = useState([])
  const [metrics, setMetrics] = useState({
    total: 0,
    abiertos: 0,
    cerrados: 0,
    criticos: 0,
  })

  const [form, setForm] = useState(emptyForm)
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    technician: '',
  })

  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Cargar incidentes y métricas cuando cambien los filtros
  // o se solicite una actualización.
  useEffect(() => {
    let active = true

    async function fetchData() {
      try {
        const params = new URLSearchParams(
          Object.entries(filters).filter(([, value]) => value)
        )

        const [incidentsResponse, metricsResponse] = await Promise.all([
          fetch(`${API}/incidents?${params}`),
          fetch(`${API}/metrics`),
        ])

        if (!incidentsResponse.ok) {
          throw new Error('No se pudieron cargar los incidentes')
        }

        if (!metricsResponse.ok) {
          throw new Error('No se pudieron cargar las métricas')
        }

        const [items, stats] = await Promise.all([
          incidentsResponse.json(),
          metricsResponse.json(),
        ])

        if (active) {
          setIncidents(items)
          setMetrics(stats)
          setError('')
        }
      } catch (e) {
        if (active) {
          setError(
            `${e.message}. Verifica que la API esté ejecutándose en ${API}.`
          )
        }
      }
    }

    fetchData()

    return () => {
      active = false
    }
  }, [filters, refreshKey])

  async function createIncident(e) {
    e.preventDefault()
    setBusy(true)
    setError('')

    try {
      const response = await fetch(`${API}/incidents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          assigned_to: form.assigned_to || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const detail = data.detail
        const message = Array.isArray(detail)
          ? detail.map((item) => item.msg).join(', ')
          : detail

        throw new Error(message || 'No se pudo crear el incidente')
      }

      setForm({ ...emptyForm })
      setRefreshKey((previous) => previous + 1)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function updateIncident(id, patch) {
    try {
      const response = await fetch(`${API}/incidents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patch),
      })

      if (!response.ok) {
        throw new Error('No se pudo actualizar el incidente')
      }

      setRefreshKey((previous) => previous + 1)
    } catch (e) {
      setError(e.message)
    }
  }

  async function addComment(id) {
    const comment = window.prompt('Comentario de seguimiento:')

    if (!comment?.trim()) {
      return
    }

    const author =
      window.prompt('Nombre de quien comenta:') || 'Operador'

    try {
      const response = await fetch(`${API}/incidents/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author,
          comment,
        }),
      })

      if (!response.ok) {
        throw new Error('No se pudo guardar el comentario')
      }

      window.alert('Comentario guardado en la bitácora.')
      setRefreshKey((previous) => previous + 1)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <main className="shell">
      <header>
        <div>
          <p className="eyebrow">CENTRO DE OPERACIONES TI</p>
          <h1>IT Incident Hub</h1>
          <p className="muted">
            Registro, asignación y seguimiento de incidentes.
          </p>
        </div>

        <span className="pill">Starter v0.1.0</span>
      </header>

      {error && <div className="error">{error}</div>}

      <section className="metrics">
        {[
          ['Total', metrics.total],
          ['Abiertos', metrics.abiertos],
          ['Cerrados', metrics.cerrados],
          ['Críticos abiertos', metrics.criticos],
        ].map(([label, value]) => (
          <article className="metric" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="panel">
        <h2>Registrar incidente</h2>

        <form onSubmit={createIncident} className="form-grid">
          <label>
            Título
            <input
              required
              minLength={3}
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </label>

          <label>
            Reportado por
            <input
              required
              value={form.reported_by}
              onChange={(e) =>
                setForm({ ...form, reported_by: e.target.value })
              }
            />
          </label>

          <label className="wide">
            Descripción
            <textarea
              required
              minLength={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>

          <label>
            Categoría
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              {[
                'Redes',
                'Hardware',
                'Software',
                'Accesos',
                'Correo',
                'Otro',
              ].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            Prioridad
            <select
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
            >
              {['BAJA', 'MEDIA', 'ALTA', 'CRITICA'].map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>

          <label>
            Técnico asignado
            <input
              value={form.assigned_to}
              onChange={(e) =>
                setForm({ ...form, assigned_to: e.target.value })
              }
              placeholder="Opcional"
            />
          </label>

          <div className="wide">
            <button type="submit" disabled={busy}>
              {busy ? 'Guardando…' : 'Crear incidente'}
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>Incidentes</h2>

          <button
            type="button"
            className="secondary"
            onClick={() =>
              setRefreshKey((previous) => previous + 1)
            }
          >
            Actualizar
          </button>
        </div>

        <div className="filters">
          <select
            aria-label="Filtrar por estado"
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="">Todos los estados</option>
            {[
              'NUEVO',
              'ASIGNADO',
              'EN_PROCESO',
              'RESUELTO',
              'CERRADO',
            ].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            aria-label="Filtrar por prioridad"
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
          >
            <option value="">Todas las prioridades</option>
            {['BAJA', 'MEDIA', 'ALTA', 'CRITICA'].map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>

          <input
            aria-label="Filtrar por categoría"
            placeholder="Categoría…"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          />

          <input
            aria-label="Filtrar por técnico"
            placeholder="Técnico…"
            value={filters.technician}
            onChange={(e) =>
              setFilters({ ...filters, technician: e.target.value })
            }
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID / título</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Técnico</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id}>
                  <td>
                    <strong>
                      #{incident.id} · {incident.title}
                    </strong>

                    <small>
                      {incident.category} · {incident.reported_by}
                    </small>

                    <small>
                      {incident.created_at
                        ? new Date(
                            incident.created_at
                          ).toLocaleString()
                        : 'Fecha no disponible'}
                    </small>
                  </td>

                  <td>
                    <span
                      className={`priority ${incident.priority.toLowerCase()}`}
                    >
                      {incident.priority}
                    </span>
                  </td>

                  <td>
                    <select
                      aria-label={`Estado del incidente ${incident.id}`}
                      value={incident.status}
                      onChange={(e) =>
                        updateIncident(incident.id, {
                          status: e.target.value,
                        })
                      }
                    >
                      {[
                        'NUEVO',
                        'ASIGNADO',
                        'EN_PROCESO',
                        'RESUELTO',
                        'CERRADO',
                      ].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      aria-label={`Técnico del incidente ${incident.id}`}
                      defaultValue={incident.assigned_to || ''}
                      placeholder="Sin asignar"
                      onBlur={(e) => {
                        const value = e.target.value

                        if (value !== (incident.assigned_to || '')) {
                          updateIncident(incident.id, {
                            assigned_to: value || null,
                          })
                        }
                      }}
                    />
                  </td>

                  <td>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => addComment(incident.id)}
                    >
                      Añadir comentario
                    </button>{' '}

                    <a
                      href={`${API}/incidents/${incident.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver bitácora API
                    </a>
                  </td>
                </tr>
              ))}

              {incidents.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty">
                    No hay incidentes con estos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="muted footnote">
          Distribución por categoría:{' '}
          {Object.entries(metrics.por_categoria || {})
            .map(([key, value]) => `${key}: ${value}`)
            .join(' · ') || 'Sin datos'}.
        </p>

        <p className="muted footnote">
          Distribución por técnico:{' '}
          {Object.entries(metrics.por_tecnico || {})
            .map(([key, value]) => `${key}: ${value}`)
            .join(' · ') || 'Sin datos'}.
        </p>
      </section>

      <footer>
        IT Incident Hub · Proyecto integrador DevOps · No usar en
        producción sin autenticación y controles adicionales.
      </footer>
    </main>
  )
}
