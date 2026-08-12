import { useState } from 'react'

const empty = { nom: '', code: '', coefficient: 1 }

export default function Matieres({ matieres, notes, addMatiere, deleteMatiere }) {
  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState(empty)
  const [search, setSearch] = useState('')

  const filtered = matieres.filter(m =>
    `${m.nom} ${m.code}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = async (ev) => {
    ev.preventDefault()
    if (!form.nom || !form.code) return
    await addMatiere({ ...form, coefficient: Number(form.coefficient) })
    setForm(empty)
    setModal(false)
  }

  const handleDelete = (m) => {
    if (window.confirm(`Supprimer la matière « ${m.nom} » ?`)) deleteMatiere(m.id)
  }

  const colors = ['blue', 'green', 'orange', 'accent', 'purple']

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Matières</h1>
          <p>Gestion des matières du programme</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          + Ajouter une matière
        </button>
      </div>

      {/* Cards matières */}
      <div className="mat-cards">
        {filtered.map((m, i) => {
          const nbNotes = notes.filter(n => n.matiereId === m.id).length
          const moy     = nbNotes
            ? (notes.filter(n => n.matiereId === m.id).reduce((s, n) => s + n.note, 0) / nbNotes).toFixed(1)
            : null
          const col = colors[i % colors.length]
          return (
            <div key={m.id} className={`mat-card mc-${col}`}>
              <div className="mc-top">
                <div className="mc-icon">📚</div>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m)}>🗑</button>
              </div>
              <div className="mc-name">{m.nom}</div>
              <div className="mc-meta">
                <span className="badge badge-blue">{m.code}</span>
                <span className="badge badge-orange">Coef. {m.coefficient}</span>
              </div>
              <div className="mc-stats">
                <div className="mc-stat">
                  <span className="mc-stat-num">{nbNotes}</span>
                  <span className="mc-stat-lbl">note{nbNotes > 1 ? 's' : ''}</span>
                </div>
                <div className="mc-stat">
                  <span className="mc-stat-num">{moy ?? '—'}</span>
                  <span className="mc-stat-lbl">moyenne</span>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div>📚</div>
            <p>Aucune matière trouvée</p>
            <small>Cliquez sur « Ajouter » pour commencer</small>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="table-container" style={{ marginTop: 24 }}>
        <div className="table-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h3>Détail des matières</h3>
            <span className="count-badge">{filtered.length}</span>
          </div>
          <input
            className="search-input"
            placeholder="🔍  Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {filtered.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Matière</th>
                <th>Code</th>
                <th>Coefficient</th>
                <th>Nb. notes</th>
                <th>Moyenne</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const ns  = notes.filter(n => n.matiereId === m.id)
                const moy = ns.length ? (ns.reduce((s, n) => s + n.note, 0) / ns.length).toFixed(1) : null
                return (
                  <tr key={m.id}>
                    <td><span className="etu-name">{m.nom}</span></td>
                    <td><span className="badge badge-blue">{m.code}</span></td>
                    <td><span className="badge badge-orange">×{m.coefficient}</span></td>
                    <td><span className="count-badge">{ns.length}</span></td>
                    <td>{moy ? <span className="note-inline">{moy} / 20</span> : <span style={{ color: 'var(--gray)' }}>—</span>}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m)}>🗑 Supprimer</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-icon">📚</span>
              <h2>Nouvelle matière</h2>
            </div>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Nom de la matière *</label>
                <input placeholder="Ex: Génie Logiciel" value={form.nom}  onChange={e => setForm(p => ({...p, nom: e.target.value}))} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Code *</label>
                  <input placeholder="Ex: GL401" value={form.code} onChange={e => setForm(p => ({...p, code: e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label>Coefficient</label>
                  <input type="number" min="1" max="10" value={form.coefficient} onChange={e => setForm(p => ({...p, coefficient: e.target.value}))} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
