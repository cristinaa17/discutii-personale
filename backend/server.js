const express = require("express");
const cors = require("cors");
const db = require("./db");
const { uploadsDir } = require("./runtime-paths");
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use("/uploads", express.static(uploadsDir));

app.get("/api/discussions/search", (req, res) => {
  const rawQ = (req.query.q || "").trim();
  console.log(`\n[SEARCH] query="${rawQ}"`);

  if (rawQ.length < 2) {
    console.warn("[SEARCH][SKIP] query prea scurt");
    return res.json([]);
  }

  const q = `%${rawQ}%`;

  db.all(
    `
    SELECT d.id, d.text, d.date, d.memberId, m.nume
    FROM discussion d
    JOIN member m ON m.id = d.memberId
    WHERE d.text LIKE ?
    ORDER BY d.date DESC
    `,
    [q],
    (err, rows) => {
      if (err) {
        console.error("[SEARCH][DB][ERROR]", err);
        return res.status(500).json(err);
      }

      console.log(`[SEARCH] ${rows.length} rezultate`);
      res.json(rows);
    },
  );
});

app.get("/api/discussions/:memberId", (req, res) => {
  const memberId = req.params.memberId;
  console.log(`\n[DISCUSSION][GET] memberId=${memberId}`);

  db.all(
    "SELECT * FROM discussion WHERE memberId = ? ORDER BY date DESC",
    [memberId],
    (err, rows) => {
      if (err) {
        console.error("[DISCUSSION][GET][ERROR]", err);
        return res.status(500).json(err);
      }

      console.log(`[DISCUSSION][GET] ${rows.length} discuții`);
      res.json(rows);
    },
  );
});

app.post("/api/discussions", (req, res) => {
  const { memberId, text } = req.body;
  console.log(
    `\n[IMPORT][DISCUSSION] memberId=${memberId}, textLength=${text?.length}`,
  );

  if (!memberId) {
    console.warn("[IMPORT][DISCUSSION][SKIP] memberId lipsă");
    return res.status(400).json({ error: "memberId lipsă" });
  }

  if (typeof text !== "string") {
    console.warn("[IMPORT][DISCUSSION][SKIP] text invalid", text);
    return res.status(400).json({ error: "text invalid" });
  }

  if (text.trim() === "") {
    console.warn("[IMPORT][DISCUSSION][SKIP] text gol");
    return res.sendStatus(204);
  }

  const now = new Date().toISOString();

  db.run(
    "INSERT INTO discussion (memberId, text, date) VALUES (?, ?, ?)",
    [memberId, text, now],
    function (err) {
      if (err) {
        console.error("[IMPORT][DISCUSSION][DB][ERROR]", err);
        return res.status(500).json(err);
      }

      console.log(
        `[IMPORT][DISCUSSION][OK] id=${this.lastID} → memberId=${memberId}`,
      );

      res.json({
        id: this.lastID,
        memberId,
        text,
        date: now,
      });
    },
  );
});

app.put("/api/discussions/:id", (req, res) => {
  const id = req.params.id;
  const { text } = req.body;

  console.log(`\n[DISCUSSION][UPDATE] id=${id}`);

  db.run("UPDATE discussion SET text = ? WHERE id = ?", [text, id], (err) => {
    if (err) {
      console.error("[DISCUSSION][UPDATE][ERROR]", err);
      return res.status(500).json(err);
    }

    console.log(`[DISCUSSION][UPDATE][OK] id=${id}`);
    res.sendStatus(204);
  });
});

app.put("/api/discussions/:id/followup", (req, res) => {
  const id = req.params.id;
  const { hasFollowUp } = req.body;

  console.log(`\n[DISCUSSION][FOLLOWUP] id=${id}, hasFollowUp=${hasFollowUp}`);

  db.run("UPDATE discussion SET hasFollowUp = ? WHERE id = ?", [hasFollowUp ? 1 : 0, id], (err) => {
    if (err) {
      console.error("[DISCUSSION][FOLLOWUP][ERROR]", err);
      return res.status(500).json(err);
    }

    console.log(`[DISCUSSION][FOLLOWUP][OK] id=${id}`);
    res.sendStatus(204);
  });
});

app.get("/api/discussions/followup/count", (req, res) => {
  console.log(`\n[DISCUSSION][FOLLOWUP][COUNT]`);

  db.get("SELECT COUNT(*) as count FROM discussion WHERE hasFollowUp = 1", (err, row) => {
    if (err) {
      console.error("[DISCUSSION][FOLLOWUP][COUNT][ERROR]", err);
      return res.status(500).json(err);
    }

    console.log(`[DISCUSSION][FOLLOWUP][COUNT][OK] count=${row.count}`);
    res.json(row);
  });
});

app.delete("/api/discussions/:id", (req, res) => {
  const id = req.params.id;
  console.log(`\n[DISCUSSION][DELETE] id=${id}`);

  db.run("DELETE FROM discussion WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("[DISCUSSION][DELETE][ERROR]", err);
      return res.status(500).json(err);
    }

    console.log(`[DISCUSSION][DELETE][OK] id=${id}`);
    res.sendStatus(204);
  });
});

app.get("/api/members", (req, res) => {
  // treat presence of the param as the flag (no need to be set to 'true')
  const includeDeleted = req.query.includeDeleted !== undefined;
  const hasFollowup = req.query.hasFollowup !== undefined;

  if (hasFollowup) {
    // return members that have at least one discussion with hasFollowUp = 1
    const sql = `SELECT DISTINCT m.* FROM member m JOIN discussion d ON d.memberId = m.id WHERE d.hasFollowUp = 1 ${includeDeleted ? '' : 'AND m.isDeleted = 0'}`;
    console.log('[MEMBER][GET] SQL:', sql);
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("[MEMBER][GET][HASFOLLOWUP][ERROR]", err);
        return res.status(500).json(err);
      }

      res.json(rows);
    });
    return;
  }

  const sql = includeDeleted
    ? "SELECT * FROM member"
    : "SELECT * FROM member WHERE isDeleted = 0";
  console.log('[MEMBER][GET] SQL:', sql);

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("[MEMBER][GET][ERROR]", err);
      return res.status(500).json(err);
    }

    res.json(rows);
  });
});

app.post("/api/members", (req, res) => {
  const m = req.body;

  console.log("\n[IMPORT][MEMBER] Payload:", {
    perNr: m.perNr,
    nume: m.nume,
  });

  if (!m.perNr || !m.nume) {
    console.warn("[IMPORT][MEMBER][SKIP] perNr sau nume lipsă");
    return res.status(400).json({
      error: "perNr și nume sunt obligatorii",
    });
  }

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
    if (err) {
      console.error(`[IMPORT][MEMBER][PerNr ${m.perNr}][DB ERROR]`, err);
      return res.status(500).json(err);
    }

    console.log(`[IMPORT][MEMBER][OK] perNr=${m.perNr} → id=${this.lastID}`);
    res.json({ id: this.lastID });
  });
});

app.put("/api/members/:id", (req, res) => {
  const id = req.params.id;
  const m = req.body;

  console.log(`\n[MEMBER][UPDATE] id=${id}`);

  const sql = `
    UPDATE member SET
      perNr=?, nume=?, dataAngajarii=?, email=?, dataNasterii=?,
      gen=?, oras=?, departament=?, businessUnit=?, norma=?, fte=?,
      formaColaborare=?, tipContract=?, functie=?, dreptConcediu=?,
      hrManager=?, project=?, projectStartDate=?, projectEndDate=?,
      client=?, projectManager=?, german=?, english=?, gLevel=?,
      skills=?, photoUrl=?
    WHERE id=?
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
      id,
    ],
    (err) => {
      if (err) {
        console.error("[MEMBER][UPDATE][ERROR]", err);
        return res.status(500).json(err);
      }

      console.log(`[MEMBER][UPDATE][OK] id=${id}`);
      res.sendStatus(204);
    },
  );
});

app.delete("/api/members/:id", (req, res) => {
  const id = req.params.id;
  console.log(`\n[MEMBER][SOFT DELETE] id=${id}`);

  db.run("UPDATE member SET isDeleted = 1 WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("[MEMBER][SOFT DELETE][ERROR]", err);
      return res.status(500).json(err);
    }

    console.log(`[MEMBER][SOFT DELETE][OK] id=${id}`);
    res.sendStatus(204);
  });
});

app.put("/api/members/:id/restore", (req, res) => {
  const id = req.params.id;
  console.log(`\n[MEMBER][RESTORE] id=${id}`);

  db.run("UPDATE member SET isDeleted = 0 WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("[MEMBER][RESTORE][ERROR]", err);
      return res.status(500).json(err);
    }

    console.log(`[MEMBER][RESTORE][OK] id=${id}`);
    res.sendStatus(204);
  });
});

const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/import/discussions", upload.single("file"), async (req, res) => {
  try {
    console.log("\n[IMPORT][DISCUSSIONS] Starting import...");
    if (!req.file) return res.status(400).json({ error: "Fisier lipsa" });

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return res.status(400).json({ error: "Fisier Excel fara foi de calcul" });
    }

    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      raw: false,
    });
    if (!rows.length) {
      return res.json({ added: 0, updatedPhotos: 0 });
    }

    const headers = {};
    rows[0].forEach((header, index) => {
      headers[String(header).trim()] = index + 1;
    });

    const perNrCol = headers["PerNr"];
    if (!perNrCol) {
      return res.status(400).json({ error: "Coloana PerNr lipsa" });
    }

    const discCols = [];
    for (let i = 1; i <= 10; i++) {
      if (headers[`Discutie${i}`]) {
        discCols.push(headers[`Discutie${i}`]);
      }
    }

    let added = 0;
    const startRow = 1;

    for (let r = startRow; r < rows.length; r++) {
      const row = rows[r];
      const perNr = String(row[perNrCol - 1] || "").trim();
      if (!perNr) continue;

      const member = await new Promise((resolve, reject) => {
        db.get("SELECT * FROM member WHERE perNr = ?", [perNr], (err, m) => {
          if (err) reject(err);
          else resolve(m);
        });
      });

      if (!member) continue;

      for (const col of discCols) {
        const text = String(row[col - 1] || "").trim();

        if (!text) continue;

        const now = new Date().toISOString();

        await new Promise((resolve, reject) => {
          db.run(
            "INSERT INTO discussion (memberId, text, date) VALUES (?, ?, ?)",
            [member.id, text, now],
            (err) => (err ? reject(err) : resolve()),
          );
        });

        added++;
      }
    }

    res.json({ added, updatedPhotos: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare import" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n Server pornit pe http://localhost:${PORT}`);
});
