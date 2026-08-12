const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001
const DB = path.join(__dirname, 'data', 'db.json')

app.use(cors())
app.use(express.json())

const read = () => JSON.parse(fs.readFileSync(DB, 'utf-8'))
const write = (data) => fs.writeFileSync(DB, JSON.stringify(data, null, 2))

// ── Étudiants ──
app.get('/api/etudiants', (_, res) => res.json(read().etudiants))

app.post('/api/etudiants', (req, res) => {
  const db = read()
  const item = { id: Date.now(), ...req.body }
  db.etudiants.push(item)
  write(db)
  res.status(201).json(item)
})

app.delete('/api/etudiants/:id', (req, res) => {
  const db = read()
  const id = Number(req.params.id)
  db.etudiants = db.etudiants.filter(e => e.id !== id)
  db.notes     = db.notes.filter(n => n.etudiantId !== id)
  write(db)
  res.json({ ok: true })
})

// ── Matières ──
app.get('/api/matieres', (_, res) => res.json(read().matieres))

app.post('/api/matieres', (req, res) => {
  const db = read()
  const item = { id: Date.now(), ...req.body }
  db.matieres.push(item)
  write(db)
  res.status(201).json(item)
})

app.delete('/api/matieres/:id', (req, res) => {
  const db = read()
  const id = Number(req.params.id)
  db.matieres = db.matieres.filter(m => m.id !== id)
  db.notes    = db.notes.filter(n => n.matiereId !== id)
  write(db)
  res.json({ ok: true })
})

// ── Notes ──
app.get('/api/notes', (_, res) => res.json(read().notes))

app.post('/api/notes', (req, res) => {
  const db = read()
  const item = { id: Date.now(), ...req.body }
  db.notes.push(item)
  write(db)
  res.status(201).json(item)
})

app.delete('/api/notes/:id', (req, res) => {
  const db = read()
  db.notes = db.notes.filter(n => n.id !== Number(req.params.id))
  write(db)
  res.json({ ok: true })
})

app.listen(PORT, () => console.log(`✅  API : http://localhost:${PORT}`))
