function getMention(note) {
  if (note >= 16) return { lbl: 'Très Bien',  cls: 'excellent' }
  if (note >= 14) return { lbl: 'Bien',        cls: 'bien'      }
  if (note >= 12) return { lbl: 'Assez Bien',  cls: 'assez'     }
  if (note >= 10) return { lbl: 'Passable',    cls: 'passable'  }
  return              { lbl: 'Insuffisant',  cls: 'insuf'     }
}

export default function Dashboard({ etudiants, matieres, notes }) {
  const moyenne = notes.length
    ? (notes.reduce((s, n) => s + n.note, 0) / notes.length).toFixed(1)
    : '—'

  const top = etudiants
    .map(e => {
      const ns = notes.filter(n => n.etudiantId === e.id)
      return { ...e, moy: ns.length ? (ns.reduce((s, n) => s + n.note, 0) / ns.length).toFixed(1) : null }
    })
    .filter(e => e.moy !== null)
    .sort((a, b) => b.moy - a.moy)

  const recents = [...notes].reverse().slice(0, 6)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble du système de gestion académique</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-cards">
        {[
          { icon: '👨‍🎓', color: 'blue',   num: etudiants.length, lbl: 'Étudiants inscrits'   },
          { icon: '📚', color: 'green',  num: matieres.length,  lbl: 'Matières enregistrées' },
          { icon: '✏️',  color: 'orange', num: notes.length,     lbl: 'Notes saisies'          },
          { icon: '📈', color: 'accent', num: moyenne,          lbl: 'Moyenne générale /20'   },
        ].map((s, i) => (
          <div key={i} className={`stat-card card-${s.color}`}>
            <div className="card-icon">{s.icon}</div>
            <div className="card-info">
              <div className="card-num">{s.num}</div>
              <div className="card-lbl">{s.lbl}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Dernières notes */}
        <div className="table-container">
          <div className="table-header">
            <h3>Dernières notes saisies</h3>
          </div>
          {recents.length === 0 ? (
            <div className="empty-state">
              <div>📋</div>
              <p>Aucune note pour l'instant</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Matière</th>
                  <th>Note</th>
                  <th>Mention</th>
                </tr>
              </thead>
              <tbody>
                {recents.map(n => {
                  const etu = etudiants.find(e => e.id === n.etudiantId)
                  const mat = matieres.find(m => m.id === n.matiereId)
                  const m   = getMention(n.note)
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
                      <td><span className="mat-name">{mat ? mat.nom : '—'}</span></td>
                      <td><span className={`note-badge n-${m.cls}`}>{n.note}</span></td>
                      <td><span className={`mention m-${m.cls}`}>{m.lbl}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Classement */}
        <div className="table-container">
          <div className="table-header">
            <h3>Classement des étudiants</h3>
          </div>
          {top.length === 0 ? (
            <div className="empty-state">
              <div>🏆</div>
              <p>Pas encore de classement</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Étudiant</th>
                  <th>Moyenne</th>
                </tr>
              </thead>
              <tbody>
                {top.map((e, i) => (
                  <tr key={e.id}>
                    <td>
                      <span className={`rank rank-${i + 1}`}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                      </span>
                    </td>
                    <td>
                      <div className="etu-cell">
                        <div className="avatar">{e.nom[0]}</div>
                        <div>
                          <div className="etu-name">{e.nom} {e.prenom}</div>
                          <div className="etu-sub">{e.numero}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`note-badge n-${getMention(e.moy).cls}`}>{e.moy}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
