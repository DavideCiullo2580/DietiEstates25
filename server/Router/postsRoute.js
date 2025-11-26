const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const express = require("express");
const router = express.Router();
const pool = require("../database");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const authenticateToken = require('../Middleware/authMiddleware');
const upload = require("../Middleware/uploadMiddleware");

const JWT_SECRET = 'Token';


// LOGIN----------------------------------------------------------------------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Credenziali non valide" });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenziali non valide" });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, role: user.ruolo });
  } catch (err) {
    res.sendStatus(500);
  }
});

// REGISTER UTENTE----------------------------------------------------------------------------------------------------------------

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing username, email or password" });
    }

    const userExist = await pool.query("SELECT username FROM users WHERE username = $1", [username]);
    if (userExist.rows.length > 0) {
      return res.status(409).json({ error: "Username già esistente" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, password, email, telefono, ruolo) VALUES ($1, $2, $3, $4, $5)",
      [username, hashedPassword, email, null, 'utente']
    );

    res.status(201).json({ message: "Utente registrato con successo" });
  } catch (err) {
    console.error("Errore in /register:", err);
    res.status(500).json({ error: "Errore server interno" });
  }
});

// REGISTER AGENZIA----------------------------------------------------------------------------------------------------------------

router.post("/register-agency", async (req, res) => {
  try {
    const { societa, pec, telefono } = req.body;

    if (!societa || !pec || !telefono) {
      console.log("Dati mancanti nella richiesta");
      return res.status(400).json({ error: "Dati mancanti" });
    }

    const exist = await pool.query("SELECT username FROM users WHERE username = $1", [societa]);
    if (exist.rows.length > 0) {
      console.log(`Società ${societa} già registrata`);
      return res.status(409).json({ error: "Società già registrata" });
    }

    const generatedPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "5fec793739f924",
        pass: "15eb9f39286b92"
      }
    });

    const mailOptions = {
      from: 'noreply@dietiestates.it',
      to: pec,
      subject: 'Benvenuto su DietiEstates25',
      text: `Grazie per esserti registrato.\nLe tue credenziali:\nUsername: ${societa}\nPassword: ${generatedPassword}`
    };

    let mailSent = false;
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Info invio mail:", info);
      if (info.accepted && info.accepted.length > 0) {
        mailSent = true;
        console.log("Mail inviata correttamente");
      } else {
        console.log("Mail non accettata da destinatario");
      }
    } catch (mailErr) {
      console.error("Errore nell'invio mail:", mailErr);
    }

    if (!mailSent) {
      console.log("Mail NON inviata, blocco inserimento dati");
      return res.status(500).json({ error: "Invio email fallito, registrazione annullata" });
    }

    console.log("Mail inviata, inserisco dati nel DB");

    await pool.query(
      `INSERT INTO public.users (username, password, email, telefono, ruolo, azienda) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [societa, hashedPassword, pec, telefono, 'amministratore', societa]
    );

    console.log("Dati inseriti con successo");

    return res.status(201).json({ message: "Azienda registrata con successo. Controlla l'email per la password." });

  } catch (err) {
    console.error("Errore in /register-agency:", err);
    return res.status(500).json({ error: "Errore server interno" });
  }
});

//cambio password amministratore-----------------------------------------------------------------------------------------------

router.post("/change-password", authenticateToken, async (req, res) => {
  try {
    const { vecchiaPassword, nuovaPassword } = req.body;
    const username = req.user.username;  

    if (!vecchiaPassword || !nuovaPassword) {
      return res.status(400).json({ error: "Vecchia o nuova password mancante" });
    }

    const userResult = await pool.query("SELECT password FROM users WHERE username = $1", [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    const user = userResult.rows[0];

    const match = await bcrypt.compare(vecchiaPassword, user.password);
    if (!match) {
      return res.status(401).json({ error: "Vecchia password errata" });
    }

    const hashedNewPassword = await bcrypt.hash(nuovaPassword, 10);

    await pool.query("UPDATE users SET password = $1 WHERE username = $2", [hashedNewPassword, username]);

    res.json({ message: "Password aggiornata con successo" });
  } catch (err) {
    console.error("Errore in /change-password:", err);
    res.status(500).json({ error: "Errore server interno" });
  }
}); 
 
//rotta per prendere il nome dell azienda dal token------------------------------------------------------------------------

router.get('/NomeAzienda', authenticateToken, async (req, res) => {
  try {
    const username = req.user.username; 
    const result = await pool.query('SELECT azienda FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) 
      return res.status(404).json({ error: "Utente non trovato" });

    return res.json({ azienda: result.rows[0].azienda });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore server" });
  }
});

// AGGIUNGI AGENTE----------------------------------------------------------------------------------------------------

router.post("/add-agent", authenticateToken, async (req, res) => {
  try {
    let { nome, email, password, confermaPassword } = req.body;

    if (!nome || !email || !password || !confermaPassword) {
      return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
    }

    if (password !== confermaPassword) {
      return res.status(400).json({ error: "Le password non corrispondono" });
    }

    const userExist = await pool.query("SELECT username FROM users WHERE username = $1", [nome]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: "Username già utilizzato." });
    }

    const creatoreUsername = req.user.username;

    const aziendaResult = await pool.query(
      "SELECT azienda FROM users WHERE username = $1",
      [creatoreUsername]
    );
    if (aziendaResult.rows.length === 0) {
      return res.status(404).json({ error: "Utente creatore non trovato" });
    }
    const azienda = aziendaResult.rows[0].azienda;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (username, password, email, telefono, ruolo, azienda) VALUES ($1, $2, $3, $4, $5, $6)`,
      [nome, hashedPassword, email, null, "agente", azienda]
    );

    res.status(201).json({ message: `Agente ${nome} registrato con successo.` });

  } catch (err) {
    console.error("Errore in /add-agent:", err);
    res.status(500).json({ error: "Errore server interno" });
  }
});

//AGGIUNGI MEMBRO---------------------------------------------------------------------------------------------------------------- 

router.post("/add-member", authenticateToken, async (req, res) => {
  try {
    const { nome, email, password, confermaPassword, ruolo } = req.body;
    const creatoreUsername = req.user.username;

    if (!nome || !email || !password || !confermaPassword || !ruolo) {
      return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
    }

    if (password !== confermaPassword) {
      return res.status(400).json({ error: "Le password non corrispondono" });
    }

    const userExist = await pool.query(
      "SELECT username FROM users WHERE username = $1",
      [nome]
    );
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: "Nome utente già esistente, scegli un altro nome." });
    }

    const aziendaResult = await pool.query(
      "SELECT azienda FROM users WHERE username = $1",
      [creatoreUsername]
    );
    if (aziendaResult.rows.length === 0) {
      return res.status(404).json({ error: "Utente creatore non trovato" });
    }

    const azienda = aziendaResult.rows[0].azienda;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, password, email, telefono, ruolo, azienda) VALUES ($1, $2, $3, $4, $5, $6)",
      [nome, hashedPassword, email, null, ruolo === "gestore" ? "gestore" : "agente", azienda]
    );

    res.status(201).json({ message: `Membro ${nome} (${ruolo}) registrato con successo nella azienda ${azienda}.` });
  } catch (err) {
    console.error("Errore in /add-member:", err);
    res.status(500).json({ error: "Errore server interno" });
  }
});

// AGGIUNGI IMMOBILE------------------------------------------------------------------------------------------------------
router.post("/immobili", authenticateToken, upload.array('immagini'), async (req, res) => {

  try {
    const {
      tipoAnnuncio,
      tipoImmobile,
      prezzo,
      dimensioni,
      stanze,
      piano,
      indirizzo,
      classeEnergetica,
      descrizione,
      servizi,
      comune
    } = req.body;

    if (!tipoAnnuncio || !tipoImmobile || !prezzo) {
      return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
    }

    let serviziArray;
    try {
      serviziArray = JSON.parse(servizi);
      if (!Array.isArray(serviziArray)) throw new Error("Non è un array");
    } catch (err) {
      return res.status(400).json({ error: "Formato servizi non valido" });
    }

    const agenteUsername = req.user.username;

    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) throw new Error("Chiave API Geoapify non configurata");

    const encodedAddress = encodeURIComponent(`${indirizzo}, ${comune}`);
    const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodedAddress}&type=street&apiKey=${apiKey}`;


    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();


    if (!geoData.features || geoData.features.length === 0) {
      return res.status(400).json({ error: "Indirizzo non trovato" });
    }

    const lat = geoData.features[0].properties.lat;
    const lng = geoData.features[0].properties.lon;


    const placesUrl = `https://api.geoapify.com/v2/places?categories=education.school,leisure.park,public_transport&filter=circle:${lng},${lat},600&apiKey=${apiKey}`;

    const placesRes = await fetch(placesUrl);
    const placesData = await placesRes.json();

    let vicino_scuole = false;
    let vicino_parchi = false;
    let vicino_trasporti = false;

    if (placesData?.features.length > 0) {
      for (const p of placesData.features) {
        const cat = p.properties.categories;

        if (cat.includes("education.school")) vicino_scuole = true;
        if (cat.includes("leisure.park")) vicino_parchi = true;
        if (cat.includes("public_transport")) vicino_trasporti = true;
      }
    }


      const result = await pool.query(
      `INSERT INTO immobili 
        (tipo_annuncio, tipo_immobile, prezzo, dimensioni, stanze, piano, indirizzo, classe_energetica, descrizione, servizi, agente_id, comune, lat, lng,
         vicino_scuole, vicino_parchi, vicino_trasporti)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
        RETURNING *`,
      [
        tipoAnnuncio,
        tipoImmobile,
        prezzo,
        dimensioni,
        stanze,
        piano,
        indirizzo,
        classeEnergetica,
        descrizione,
        JSON.stringify(serviziArray),
        agenteUsername,
        comune,
        lat,
        lng,
        vicino_scuole,
        vicino_parchi,
        vicino_trasporti
      ]
    );

    const immobileId = result.rows[0].id;


    
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await pool.query(
          `INSERT INTO immagini_immobile (immobile_id, path) VALUES ($1, $2)`,
          [immobileId, file.filename]
        );
      }
    }

    res.status(201).json({ message: "Immobile aggiunto con successo", immobileId });

  } catch (err) {
    console.error("Errore in /immobili POST:", err);
    res.status(500).json({ error: "Errore server interno" });
  }
});


// VISUALIZZA IMMOBILI DELL'AGENTE-----------------------------------------------------------------------------------------
router.get("/immobili/agente", authenticateToken, async (req, res) => {
  const agenteUsername = req.user.username;

  try {
    const result = await pool.query(
      `
      SELECT i.*, img.path AS immagine_url
      FROM immobili i
      LEFT JOIN (
        SELECT DISTINCT ON (immobile_id) immobile_id, path
        FROM immagini_immobile
        ORDER BY immobile_id, id ASC
      ) img ON i.id = img.immobile_id
      WHERE i.agente_id = $1
      ORDER BY i.created_at DESC
      `,
      [agenteUsername]
    );

    const immobili = result.rows.map((immobile) => ({
      ...immobile,
      immagine_url: immobile.immagine_url
        ? `http://localhost:8080/uploads/${immobile.immagine_url}`
        : null,
    }));


    res.json(immobili);
  } catch (err) {
    console.error("Errore nella route /immobili/agente:", err); 
    res.status(500).json({ message: "Errore nel recupero immobili" });
  }
});

//VISUALIZZA IMMOBILI-----------------------------------------------------------------------------------------

router.get("/immobili/tutti", authenticateToken, async (req, res) => {
  try {
    const {
      tipo_annuncio,
      tipo_immobile,
      prezzoMin,
      prezzoMax,
      stanzeMin,
      classeEnergetica, 
      comune,
    } = req.query;


    const conditions = [];
    const values = [];
    let index = 1;

    if (tipo_annuncio) {
      conditions.push(`tipo_annuncio = $${index++}`);
      values.push(tipo_annuncio);
    }
    if (tipo_immobile) {
      conditions.push(`tipo_immobile = $${index++}`);
      values.push(tipo_immobile);
    }
    if (prezzoMin) {
      conditions.push(`prezzo >= $${index++}`);
      values.push(Number(prezzoMin));
    }
    if (prezzoMax) {
      conditions.push(`prezzo <= $${index++}`);
      values.push(Number(prezzoMax));
    }
    if (stanzeMin) {
      conditions.push(`stanze >= $${index++}`);
      values.push(Number(stanzeMin));
    }
    if (classeEnergetica) {
      conditions.push(`classe_energetica = $${index++}`);
      values.push(classeEnergetica);
    }
    if (comune) {
      conditions.push(`comune = $${index++}`);
      values.push(comune);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT i.*, img.path AS immagine_url
      FROM immobili i
      LEFT JOIN (
        SELECT DISTINCT ON (immobile_id) immobile_id, path
        FROM immagini_immobile
        ORDER BY immobile_id, id ASC
      ) img ON i.id = img.immobile_id
      ${whereClause}
      ORDER BY i.created_at DESC
    `;


    const result = await pool.query(query, values);

  
    const immobili = result.rows.map((immobile) => ({
      ...immobile,
      immagine_url: immobile.immagine_url
        ? `http://localhost:8080/uploads/${immobile.immagine_url}`
        : null,
    }));

    res.json(immobili);
  } catch (err) {
    console.error("Errore nella route /immobili:", err);
    res.status(500).json({ message: "Errore nel recupero immobili" });
  }
});

// VISUALIZZA IMMOBILI AZIENDA -----------------------------------------------------------------------------------------

router.get('/immobili/azienda', authenticateToken, async (req, res) => {
  try {
    const username = req.user.username; 

    const aziendaResult = await pool.query(
      'SELECT azienda FROM users WHERE username = $1',
      [username]
    );

    if (aziendaResult.rows.length === 0) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    const azienda = aziendaResult.rows[0].azienda;

    const result = await pool.query(
      `
      SELECT i.*, img.path AS immagine_url
      FROM immobili i
      JOIN users u 
        ON i.agente_id = u.username
      LEFT JOIN (
          SELECT DISTINCT ON (immobile_id) immobile_id, path
          FROM immagini_immobile
          ORDER BY immobile_id, id ASC
      ) img ON i.id = img.immobile_id
      WHERE u.azienda = $1
        AND u.ruolo = 'agente'
      ORDER BY i.created_at DESC
      `,
      [azienda]
    );

    const immobili = result.rows.map((immobile) => ({
      ...immobile,
      immagine_url: immobile.immagine_url
        ? `http://localhost:8080/uploads/${immobile.immagine_url}`
        : null,
    }));

    res.json(immobili);
  } catch (err) {
    console.error("Errore in /immobili/azienda:", err);
    res.status(500).json({ message: "Errore server interno" });
  }
});

//AGGIORNA VISUALIZZAZIONI IMMOBILE-----------------------------------------------------------------------------------------

router.post("/immobili/:id/aggiorna-visualizzazioni", async (req, res) => {
  const immobileId = req.params.id;

  try {

    const result = await pool.query(
      "UPDATE immobili SET visualizzazioni = COALESCE(visualizzazioni, 0) + 1 WHERE id = $1 RETURNING visualizzazioni",
      [immobileId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Immobile non trovato" });
    }

    res.json({ message: "Visualizzazioni aggiornate", visualizzazioni: result.rows[0].visualizzazioni });
  } catch (err) {
    console.error("Errore in /immobili/:id/aggiorna-visualizzazioni:", err);
    res.status(500).json({ error: "Errore server interno" });
  }
});

//VISUALIZZA IMMOBILI PER LA DASHBOARD---------------------------------------------------------------------------------------------

router.get("/DashboardImmobili", authenticateToken, async (req, res) => {
  try {
    const agenteUsername = req.user.username;

    const result = await pool.query(
      `
      SELECT i.*, img.path AS immagine_url
      FROM immobili i
      LEFT JOIN (
          SELECT DISTINCT ON (immobile_id) immobile_id, path
          FROM immagini_immobile
          ORDER BY immobile_id, id ASC
      ) img ON i.id = img.immobile_id
      WHERE i.agente_id = $1
      ORDER BY i.created_at DESC
      `,
      [agenteUsername]
    );

    const immobili = result.rows.map((immobile) => ({
      ...immobile,
      immagine_url: immobile.immagine_url
        ? `http://localhost:8080/uploads/${immobile.immagine_url}`
        : null,
    }));

    res.status(200).json({ immobili });
  } catch (err) {
    console.error("Errore in /DashboardImmobili:", err);
    res.status(500).json({ error: "Errore server interno" });
  }
});

//ESPORTAZIONE PDF---------------------------------------------------------------------------------------------------------

router.get("/DashboardImmobili/pdf", authenticateToken, async (req, res) => {
  try {
    const agenteUsername = req.user.username;

    const result = await pool.query(`
      SELECT i.*, img.path AS immagine_url
      FROM immobili i
      LEFT JOIN (
          SELECT DISTINCT ON (immobile_id) immobile_id, path
          FROM immagini_immobile
          ORDER BY immobile_id, id ASC
      ) img ON i.id = img.immobile_id
      WHERE i.agente_id = $1
      ORDER BY i.created_at DESC
    `, [agenteUsername]);

    const immobili = result.rows;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="report_immobili.pdf"');

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    doc.fontSize(20).text("Report Immobili", { align: "center" });
    doc.moveDown(1);

    immobili.forEach((i, idx) => {
      doc.fontSize(12).text(`Immobile #${idx + 1}`, { underline: true });
      doc.text(`Tipo annuncio: ${i.tipo_annuncio || "N/D"}`);
      doc.text(`Tipo immobile: ${i.tipo_immobile || "N/D"}`);
      doc.text(`Prezzo: € ${i.prezzo || "N/D"}`);
      doc.text(`Dimensioni: ${i.dimensioni || "N/D"} m²`);
      doc.text(`Stanze: ${i.stanze || "N/D"}`);
      doc.text(`Piano: ${i.piano || "N/D"}`);
      doc.text(`Indirizzo: ${i.indirizzo || "N/D"}`);
      doc.text(`Classe energetica: ${i.classe_energetica || "N/D"}`);
      doc.text(`Descrizione: ${i.descrizione || "N/D"}`);
      doc.text(`Servizi: ${i.servizi || "N/D"}`);
      doc.text(`Comune: ${i.comune || "N/D"}`);
      doc.moveDown(1);
    });

    doc.end();
  } catch (err) {
    console.error("Errore export PDF:", err);
    res.status(500).json({ error: "Errore durante l’esportazione del PDF" });
  }
});

//ESPORTAZIONE EXCEL---------------------------------------------------------------------------------------------------------

router.get("/DashboardImmobili/excel", authenticateToken, async (req, res) => {
  try {
    const agenteUsername = req.user.username;

    const result = await pool.query(`
      SELECT i.*, img.path AS immagine_url
      FROM immobili i
      LEFT JOIN (
          SELECT DISTINCT ON (immobile_id) immobile_id, path
          FROM immagini_immobile
          ORDER BY immobile_id, id ASC
      ) img ON i.id = img.immobile_id
      WHERE i.agente_id = $1
      ORDER BY i.created_at DESC
    `, [agenteUsername]);

    const immobili = result.rows;

    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Immobili");

    sheet.columns = [
      { header: "Tipo annuncio", key: "tipo_annuncio", width: 15 },
      { header: "Tipo immobile", key: "tipo_immobile", width: 20 },
      { header: "Prezzo (€)", key: "prezzo", width: 15 },
      { header: "Dimensioni (m²)", key: "dimensioni", width: 15 },
      { header: "Stanze", key: "stanze", width: 10 },
      { header: "Piano", key: "piano", width: 10 },
      { header: "Indirizzo", key: "indirizzo", width: 30 },
      { header: "Classe energetica", key: "classe_energetica", width: 20 },
      { header: "Descrizione", key: "descrizione", width: 30 },
      { header: "Servizi", key: "servizi", width: 30 },
      { header: "Comune", key: "comune", width: 20 },
    ];

    immobili.forEach((i) => sheet.addRow(i));

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="report_immobili.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Errore export Excel:", err);
    res.status(500).json({ error: "Errore durante l’esportazione dell’Excel" });
  }
});
module.exports = router;