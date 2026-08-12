const nav = [
  { id: 'dashboard', icon: '📊', label: 'Tableau de bord' },
  { id: 'etudiants', icon: '👨‍🎓', label: 'Étudiants' },
  { id: 'matieres',  icon: '📚', label: 'Matières' },
  { id: 'notes',     icon: '✏️',  label: 'Notes' },
]

export default function Sidebar({ page, setPage, etudiants, matieres, notes }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">G</div>
        <div>
          <h1>Gest<span>Etud</span></h1>
          <p>Système de gestion académique</p>
        </div>
      </div>

      <div className="sidebar-stats">
        {[
          { num: etudiants.length, lbl: 'Étudiants' },
          { num: matieres.length,  lbl: 'Matières'  },
          { num: notes.length,     lbl: 'Notes'     },
        ].map((s, i) => (
          <div key={i} className="sidebar-stat">
            <span className="num">{s.num}</span>
            <span className="lbl">{s.lbl}</span>
          </div>
        ))}
      </div>

      <nav className="sidebar-nav">
        <span className="nav-label">MENU</span>
        {nav.map(item => (
          <div
            key={item.id}
            className={`nav-item ${page === item.id ? 'active' : ''}`}
            onClick={() => setPage(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-tag">Master GI / MIAGE</div>
        <p>Dr KANGA KOFFI · 2025–2026</p>
      </div>
    </aside>
  )
}
