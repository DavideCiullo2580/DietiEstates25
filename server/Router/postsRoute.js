const express = require("express");
const router = express.Router();
const pool = require("../database");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const authenticateToken = require('../Middleware/authMiddleware');

const JWT_SECRET = 'Token';

// Login ----------------------------------------------------------------------------------------------------

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

    const token = jwt.sign({ userId: user.username }, JWT_SECRET, { expiresIn: '1h' });

    // Restituisci anche il ruolo
    res.json({
      token,
      role: user.ruolo  // <-- campo usato nel frontend per il redirect
    });

  } catch (err) {
    console.error("Errore in /login:", err);
    res.sendStatus(500);
  }
});


//Sign in--------------------------------------------------------------------------------------------------------------------

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing username, email or password" });
    }

    // Controlla se username già esiste
    const userExist = await pool.query("SELECT username FROM users WHERE username = $1", [username]);
    if (userExist.rows.length > 0) {
      return res.status(409).json({ error: "Username già esistente" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserisci utente con ruolo 'utente' e telefono NULL
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

// Register agenzia/azienda ----------------------------------------------------------------------------------

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
      service: 'gmail',
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
    return res.status(500).json({ error: "Errore server interno" });
  }
});





module.exports = router;
