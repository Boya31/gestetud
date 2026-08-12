import { useState } from 'react'

const empty = { nom: '', prenom: '', email: '', numero: '' }

export default function Etudiants({ etudiants, notes, addEtudiant, deleteEtudiant }) {
  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState(empty)
  const [search, setSearch] = useState('')

  const filtered = etudiants.filter(e =>
    `${e.nom} ${e.prenom} ${e.numero}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = async (ev) => {
    ev.preventDefault()
    if (!form.nom || !form.prenom) return
    await addEtudiant(form)
    setForm(empty)
    setModal(false)
  }

  const handleDelete = (e) => {
    if (window.confirm(`Supprimer ${e.nom} ${e.prenom} ?`)) deleteEtudiant(e.id)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Étudiants</h1>
          <p>Gestion des étudiants inscrits</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          + Ajouter un étudiant
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h3>Liste des étudiants</h3>
            <span className="count-badge">{filtered.length}</span>
          </div>
          <input
            className="search-input"
            placeholder="🔍  Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div>👨‍🎓</div>
            <p>Aucun étudiant trouvé</p>
            <small>Cliquez sur « Ajouter » pour commencer</small>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>N° Étudiant</th>
                <th>Email</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const nbNotes = notes.filter(n => n.etudiantId === e.id).length
                const moy     = nbNotes
                  ? (notes.filter(n => n.etudiantId === e.id).reduce((s, n) => s + n.note, 0) / nbNotes).toFixed(1)
                  : null
                return (
                  <tr key={e.id}>
                    <td>
                      <div className="etu-cell">
                        <div className="avatar">{e.nom[0]}</div>
                        <div>
                          <div className="etu-name">{e.nom} {e.prenom}</div>
                          <div className="etu-sub">{e.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{e.numero}</span></td>
                    <td style={{ color: 'var(--gray)', fontSize: 13 }}>{e.email}</td>
                    <td>
                      {moy !== null
                        ? <span className="note-inline">{moy} / 20 <span style={{ color: 'var(--gray)', fontSize: 11 }}>({nbNotes} note{nbNotes > 1 ? 's' : ''})</span></span>
                        : <span style={{ color: 'var(--gray)', fontSize: 12 }}>—</span>
                      }
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e)}>
                        🗑 Supprimer
                      </button>
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
              <span className="modal-icon">👨‍🎓</span>
              <h2>Nouvel étudiant</h2>
            </div>
            <form onSubmit={handleAdd}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom *</label>
                  <input placeholder="Ex: KONAN" value={form.nom}    onChange={e => setForm(p => ({...p, nom: e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label>Prénom *</label>
                  <input placeholder="Ex: Awa"   value={form.prenom} onChange={e => setForm(p => ({...p, prenom: e.target.value}))} required />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="email@univ.ci" value={form.email}  onChange={e => setForm(p => ({...p, email: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>N° Étudiant</label>
                <input placeholder="Ex: ETU004" value={form.numero} onChange={e => setForm(p => ({...p, numero: e.target.value}))} />
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
