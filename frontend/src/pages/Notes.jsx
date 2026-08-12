import { useState } from 'react'

const empty = { etudiantId: '', matiereId: '', note: '', date: new Date().toISOString().slice(0, 10) }

function getMention(note) {
  if (note >= 16) return { lbl: 'Très Bien',  cls: 'excellent' }
  if (note >= 14) return { lbl: 'Bien',        cls: 'bien'      }
  if (note >= 12) return { lbl: 'Assez Bien',  cls: 'assez'     }
  if (note >= 10) return { lbl: 'Passable',    cls: 'passable'  }
  return              { lbl: 'Insuffisant',  cls: 'insuf'     }
}

export default function Notes({ etudiants, matieres, notes, addNote, deleteNote }) {
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState(empty)
  const [filterEtu, setFilterEtu] = useState('')
  const [filterMat, setFilterMat] = useState('')

  const filtered = notes.filter(n => {
    const etu = filterEtu ? n.etudiantId === Number(filterEtu) : true
    const mat = filterMat ? n.matiereId  === Number(filterMat)  : true
    return etu && mat
  })

  const handleAdd = async (ev) => {
    ev.preventDefault()
    if (!form.etudiantId || !form.matiereId || form.note === '') return
    const note = Number(form.note)
    if (note < 0 || note > 20) return alert('La note doit être entre 0 et 20')
    await addNote({ ...form, etudiantId: Number(form.etudiantId), matiereId: Number(form.matiereId), note })
    setForm(empty)
    setModal(false)
  }

  const handleDelete = (n) => {
    const etu = etudiants.find(e => e.id === n.etudiantId)
    const mat = matieres.find(m => m.id === n.matiereId)
    if (window.confirm(`Supprimer la note de ${etu?.nom} en ${mat?.nom} ?`)) deleteNote(n.id)
  }

  const moyenne = filtered.length
    ? (filtered.reduce((s, n) => s + n.note, 0) / filtered.length).toFixed(1)
    : null

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Notes</h1>
          <p>Saisie et consultation des notes</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          + Saisir une note
        </button>
      </div>

      {/* Filtres */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Filtrer par étudiant</label>
          <select value={filterEtu} onChange={e => setFilterEtu(e.target.value)}>
            <option value="">Tous les étudiants</option>
            {etudiants.map(e => (
              <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Filtrer par matière</label>
          <select value={filterMat} onChange={e => setFilterMat(e.target.value)}>
            <option value="">Toutes les matières</option>
            {matieres.map(m => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>
        </div>
        {moyenne && (
          <div className="filter-moyenne">
            Moyenne filtrée : <strong>{moyenne} / 20</strong>
          </div>
        )}
      </div>

      <div className="table-container">
        <div className="table-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h3>Relevé de notes</h3>
            <span className="count-badge">{filtered.length}</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div>✏️</div>
            <p>Aucune note trouvée</p>
            <small>Cliquez sur « Saisir une note » pour commencer</small>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Matière</th>
                <th>Note</th>
                <th>Mention</th>
                <th>Barre</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(n => {
                const etu = etudiants.find(e => e.id === n.etudiantId)
                const mat = matieres.find(m => m.id === n.matiereId)
                const men = getMention(n.note)
                return (
                  <tr key={n.id}>
                    <td>
                      <div className="etu-cell">
                        <div className="avatar">{etu ? etu.nom[0] : '?'}</div>
                        <div>
                          <div className="etu-name">{etu ? `${etu.nom} ${etu.prenom}` : '—'}</div>
                          <div className="etu-sub">{etu?.numero}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="etu-name" style={{ fontSize: 13 }}>{mat?.nom ?? '—'}</div>
                      {mat && <div className="etu-sub">Coef. {mat.coefficient}</div>}
                    </td>
                    <td><span className={`note-badge n-${men.cls}`}>{n.note}</span></td>
                    <td><span className={`mention m-${men.cls}`}>{men.lbl}</span></td>
                    <td>
                      <div className="note-bar-wrap">
                        <div className="note-bar" style={{ width: `${(n.note / 20) * 100}%`, background: n.note >= 10 ? 'var(--green)' : 'var(--red)' }} />
                        <span className="note-bar-pct">{n.note}/20</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--gray)', fontSize: 12 }}>{n.date || '—'}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n)}>🗑</button>
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
              <span className="modal-icon">✏️</span>
              <h2>Saisir une note</h2>
            </div>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Étudiant *</label>
                <select value={form.etudiantId} onChange={e => setForm(p => ({...p, etudiantId: e.target.value}))} required>
                  <option value="">— Choisir un étudiant —</option>
                  {etudiants.map(e => (
                    <option key={e.id} value={e.id}>{e.nom} {e.prenom} ({e.numero})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Matière *</label>
                <select value={form.matiereId} onChange={e => setForm(p => ({...p, matiereId: e.target.value}))} required>
                  <option value="">— Choisir une matière —</option>
                  {matieres.map(m => (
                    <option key={m.id} value={m.id}>{m.nom} (Coef. {m.coefficient})</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Note * (0 – 20)</label>
                  <input type="number" min="0" max="20" step="0.25" placeholder="Ex: 14.5"
                    value={form.note} onChange={e => setForm(p => ({...p, note: e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} />
                </div>
              </div>
              {form.note !== '' && (
                <div className={`note-preview n-${getMention(Number(form.note)).cls}`}>
                  {Number(form.note)} / 20 — {getMention(Number(form.note)).lbl}
                </div>
              )}
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
