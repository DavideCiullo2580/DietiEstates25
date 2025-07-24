const express = require("express");
const router = express.Router();
const pool = require("../database");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const authenticateToken = require('../Middleware/authMiddleware');
const upload = require("../Middleware/uploadMiddleware");

const JWT_SECRET = 'Token';


// LOGIN
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

    // Inseriamo direttamente lo username nel token
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

// REGISTER UTENTE
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


// REGISTER AGENZIA
router.post("/register-agency", async (req, res) => {
  try {
    const { societa, pec, telefono } = req.body;

    if (!societa || !pec || !telefono) {
      return res.status(400).json({ error: "Dati mancanti" });
    }

    const exist = await pool.query("SELECT username FROM users WHERE username = $1", [societa]);
    if (exist.rows.length > 0) {
      return res.status(409).json({ error: "Società già registrata" });
    }

    const generatedPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: 'davideciullo2@gmail.com',
        pass: 'progetto' // usa app password
      }
    });

    const mailOptions = {
      from: 'davideciullo2@gmail.com',
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
    } else {
      console.log("Mail inviata, inserisco dati nel DB");
      await pool.query(
        "INSERT INTO users (username, password, email, telefono, ruolo) VALUES ($1, $2, $3, $4, $5)",
        [societa, hashedPassword, pec, telefono, 'amministratore']
      );
      console.log("Dati inseriti con successo");
      return res.status(201).json({ message: "Azienda registrata con successo. Controlla l'email per la password." });
    }

  } catch (err) {
    console.error("Errore in /register-agency:", err);
    res.status(500).json({ error: "Errore server interno" });
  }
});


// AGGIUNGI AGENTE
router.post("/add-agent", async (req, res) => {
  try {
    const { nome, email, password, confermaPassword } = req.body;

    if (!nome || !email || !password || !confermaPassword) {
      return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
    }

    if (password !== confermaPassword) {
      return res.status(400).json({ error: "Le password non corrispondono" });
    }

    const baseUsername = nome.toLowerCase().replace(/\s+/g, '');
    let finalUsername = baseUsername + Math.floor(Math.random() * 1000);

    let userExist = await pool.query("SELECT username FROM users WHERE username = $1", [finalUsername]);
    while (userExist.rows.length > 0) {
      finalUsername = baseUsername + Math.floor(Math.random() * 1000);
      userExist = await pool.query("SELECT username FROM users WHERE username = $1", [finalUsername]);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, password, email, telefono, ruolo) VALUES ($1, $2, $3, $4, $5)",
      [finalUsername, hashedPassword, email, null, "agente"]
    );

    res.status(201).json({ message: `Agente ${finalUsername} registrato con successo.` });

  } catch (err) {
    console.error("Errore in /add-agent:", err);
    res.status(500).json({ error: "Errore server interno" });
  }
});

<<<<<<< HEAD




=======
>>>>>>> 7e81a3409bf699498340dbc459b37bda048da0fa
module.exports = router;
