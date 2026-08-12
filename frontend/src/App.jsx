import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || ''
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Etudiants from './pages/Etudiants'
import Matieres from './pages/Matieres'
import Notes from './pages/Notes'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [etudiants, setEtudiants] = useState([])
  const [matieres, setMatieres]   = useState([])
  const [notes, setNotes]         = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/etudiants`).then(r => r.json()),
      fetch(`${API}/api/matieres`).then(r => r.json()),
      fetch(`${API}/api/notes`).then(r => r.json()),
    ]).then(([e, m, n]) => {
      setEtudiants(e)
      setMatieres(m)
      setNotes(n)
      setLoading(false)
    })
  }, [])

  const addEtudiant = async (data) => {
    const res = await fetch(`${API}/api/etudiants', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    const item = await res.json()
    setEtudiants(p => [...p, item])
  }

  const deleteEtudiant = async (id) => {
    await fetch(`/api/etudiants/${id}`, { method: 'DELETE' })
    setEtudiants(p => p.filter(e => e.id !== id))
    setNotes(p => p.filter(n => n.etudiantId !== id))
  }

  const addMatiere = async (data) => {
    const res = await fetch(`${API}/api/matieres', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    const item = await res.json()
    setMatieres(p => [...p, item])
  }

  const deleteMatiere = async (id) => {
    await fetch(`/api/matieres/${id}`, { method: 'DELETE' })
    setMatieres(p => p.filter(m => m.id !== id))
    setNotes(p => p.filter(n => n.matiereId !== id))
  }

  const addNote = async (data) => {
    const res = await fetch(`${API}/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    const item = await res.json()
    setNotes(p => [...p, item])
  }

  const deleteNote = async (id) => {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    setNotes(p => p.filter(n => n.id !== id))
  }

  const props = { etudiants, matieres, notes, addEtudiant, deleteEtudiant, addMatiere, deleteMatiere, addNote, deleteNote }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--accent)', fontSize: 18 }}>
      Chargement…
    </div>
  )

  const pages = { dashboard: Dashboard, etudiants: Etudiants, matieres: Matieres, notes: Notes }
  const Page  = pages[page]

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} etudiants={etudiants} matieres={matieres} notes={notes} />
      <main className="main-content">
        <Page {...props} />
      </main>
    </div>
  )
}
