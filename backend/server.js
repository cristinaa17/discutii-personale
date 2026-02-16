const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

app.get('/api/members', (req, res) => {
  const showAll = req.query.showAll === 'true';

  const sql = showAll
    ? 'SELECT * FROM member'
    : 'SELECT * FROM member WHERE isDeleted = 0';

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('[MEMBER][GET][ERROR]', err);
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

  db.run(sql, [...Object.values(m), id], (err) => {
    if (err) {
      console.error("[MEMBER][UPDATE][ERROR]", err);
      return res.status(500).json(err);
    }

    console.log(`[MEMBER][UPDATE][OK] id=${id}`);
    res.sendStatus(204);
  });
});

app.delete('/api/members/:id', (req, res) => {
  const id = req.params.id;
  console.log(`\n[MEMBER][SOFT DELETE] id=${id}`);

  db.run(
    'UPDATE member SET isDeleted = 1 WHERE id = ?',
    [id],
    err => {
      if (err) {
        console.error('[MEMBER][SOFT DELETE][ERROR]', err);
        return res.status(500).json(err);
      }

      console.log(`[MEMBER][SOFT DELETE][OK] id=${id}`);
      res.sendStatus(204);
    }
  );
});

const multer = require("multer");
const ExcelJS = require("exceljs");
const fs = require("fs");

const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/import/discussions", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Fisier lipsa" });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0];

    console.log("IMAGES FOUND:", worksheet.getImages().length);

    const images = worksheet.getImages();

    const headerRow = worksheet.getRow(1);
    const headers = {};
    headerRow.eachCell((cell, col) => {
      headers[cell.value] = col;
    });

    const perNrCol = headers["PerNr"];

    const discCols = [];
    for (let i = 1; i <= 10; i++) {
      if (headers[`Discutie${i}`]) {
        discCols.push(headers[`Discutie${i}`]);
      }
    }

    const photosDir = path.join(__dirname, "uploads/photos");
    fs.mkdirSync(photosDir, { recursive: true });

    let added = 0;
    let updatedPhotos = 0;

    for (let r = 2; r <= worksheet.rowCount; r++) {
      const row = worksheet.getRow(r);
      const perNr = String(row.getCell(perNrCol).value || "").trim();
      if (!perNr) continue;

      const member = await new Promise((resolve, reject) => {
        db.get("SELECT * FROM member WHERE perNr = ?", [perNr], (err, m) => {
          if (err) reject(err);
          else resolve(m);
        });
      });

      if (!member) continue;

      const imageOnRow = images.find((img) => {
        const startRow = img.range.tl.nativeRow + 1;
        const endRow = img.range.br.nativeRow + 1;
        return r >= startRow && r <= endRow;
      });

      if (imageOnRow) {
        const media = workbook.model.media.find(
          (m) => m.index === imageOnRow.imageId,
        );

        if (media?.buffer) {
          const fileName = `${member.perNr}_${Date.now()}.png`;
          const savePath = path.join(photosDir, fileName);

          fs.writeFileSync(savePath, media.buffer);

          const publicUrl = `/uploads/photos/${fileName}`;

          await new Promise((resolve, reject) => {
            db.run(
              "UPDATE member SET photoUrl = ? WHERE id = ?",
              [publicUrl, member.id],
              (err) => (err ? reject(err) : resolve()),
            );
          });

          updatedPhotos++;
        }
      }

      for (const col of discCols) {
        let cellValue = row.getCell(col).value;
        let text = "";

        if (typeof cellValue === "string") {
          text = cellValue;
        } else if (cellValue?.richText) {
          text = cellValue.richText.map((rt) => rt.text).join("");
        } else if (cellValue?.text) {
          text = cellValue.text;
        } else {
          text = "";
        }

        text = text.trim();

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

    res.json({ added, updatedPhotos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare import" });
  }
  console.log("IMAGES FOUND:", worksheet.getImages().length);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n Server pornit pe http://localhost:${PORT}`);
});
