const express = require('express');
const cors = require('cors');
const path = require('path');              
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());


app.get('/api/discussions/search', (req, res) => {
  const q = `%${req.query.q || ''}%`;

  db.all(
    `
    SELECT 
      d.id,
      d.text,
      d.date,
      d.memberId,
      m.nume
    FROM discussion d
    JOIN member m ON m.id = d.memberId
    WHERE d.text LIKE ?
    ORDER BY d.date DESC
    `,
    [q],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

app.get('/api/discussions/:memberId', (req, res) => {
  db.all(
    'SELECT * FROM discussion WHERE memberId = ? ORDER BY date DESC',
    [req.params.memberId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

app.post('/api/discussions', (req, res) => {
  const { memberId, text } = req.body;
  const now = new Date().toISOString();

  db.run(
    'INSERT INTO discussion (memberId, text, date) VALUES (?, ?, ?)',
    [memberId, text, now],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({
        id: this.lastID,
        memberId,
        text,
        date: now
      });
    }
  );
});

app.put('/api/discussions/:id', (req, res) => {
  const { text } = req.body;
  const id = req.params.id;

  db.run(
    'UPDATE discussion SET text = ? WHERE id = ?',
    [text, id],
    function (err) {
      if (err) return res.status(500).json(err);

      res.sendStatus(204);
    }
  );
});


app.delete('/api/discussions/:id', (req, res) => {
  db.run(
    'DELETE FROM discussion WHERE id = ?',
    [req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.sendStatus(204);
    }
  );
});

app.get('/api/members', (req, res) => {
  db.all('SELECT * FROM member', [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post('/api/members', (req, res) => {
  const m = req.body;
  
  const sql = `
    INSERT INTO member (
      perNr, nume, dataAngajarii, email, dataNasterii, gen, oras,
      departament, businessUnit, norma, fte, formaColaborare,
      tipContract, functie, dreptConcediu, hrManager,
      project, projectStartDate, projectEndDate, client,
      projectManager, german, english, gLevel, skills, photoUrl
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  db.run(sql, Object.values(m), function (err) {
    if (err) return res.status(500).json(err);
    res.json({ id: this.lastID });
  });
});

app.delete('/api/members/:id', (req, res) => {
  db.run('DELETE FROM member WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.sendStatus(204);
  });
});

app.put('/api/members/:id', (req, res) => {
  const id = req.params.id;
  const m = req.body;

  const sql = `
    UPDATE member SET
      perNr = ?,
      nume = ?,
      dataAngajarii = ?,
      email = ?,
      dataNasterii = ?,
      gen = ?,
      oras = ?,
      departament = ?,
      businessUnit = ?,
      norma = ?,
      fte = ?,
      formaColaborare = ?,
      tipContract = ?,
      functie = ?,
      dreptConcediu = ?,
      hrManager = ?,
      project = ?,
      projectStartDate = ?,
      projectEndDate = ?,
      client = ?,
      projectManager = ?,
      german = ?,
      english = ?,
      gLevel = ?,
      skills = ?,
      photoUrl = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [
      m.perNr,
      m.nume,
      m.dataAngajarii,
      m.email,
      m.dataNasterii,
      m.gen,
      m.oras,
      m.departament,
      m.businessUnit,
      m.norma,
      m.fte,
      m.formaColaborare,
      m.tipContract,
      m.functie,
      m.dreptConcediu,
      m.hrManager,
      m.project,
      m.projectStartDate,
      m.projectEndDate,
      m.client,
      m.projectManager,
      m.german,
      m.english,
      m.gLevel,
      m.skills,
      m.photoUrl,
      id
    ],
    err => {
      if (err) return res.status(500).json(err);
      res.sendStatus(204);
    }
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server pornit pe http://localhost:${PORT}`);
});
