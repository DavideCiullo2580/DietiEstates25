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

    res.json({
      token,
      role: user.ruolo  
    });

  } catch (err) {
    console.error("Errore in /login:", err);
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
      servizi
    } = req.body;

    if (!tipoAnnuncio || !tipoImmobile || !prezzo) {
      return res.status(400).json({ error: "Tutti i campi obbligatori sono obbligatori" });
    } 

    let serviziArray;
    try {
      serviziArray = JSON.parse(servizi);
      if (!Array.isArray(serviziArray)) throw new Error("Non è un array");
    } catch (err) {
      return res.status(400).json({ error: "Formato servizi non valido" });
    }

    const agenteUsername = req.user.username;

    const result = await pool.query(
      `INSERT INTO immobili (tipo_annuncio, tipo_immobile, prezzo, dimensioni, stanze, piano, indirizzo, classe_energetica, descrizione, servizi, agente_id) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
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
        agenteUsername
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

router.get("/immobili/miei", authenticateToken, async (req, res) => {
  const agenteUsername = req.user.username;

  try {
    const result = await pool.query(
      "SELECT * FROM immobili WHERE agente_id = $1 ORDER BY created_at DESC",
      [agenteUsername]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore nel recupero immobili" });
  }
});

module.exports = router;
