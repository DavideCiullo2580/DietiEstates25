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

    res.json({
      token,
      role: user.ruolo  
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

// Register agenzia/azienda ----------------------------------------------------------------------------------

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
        user: "5fec793739f924",
        pass: "15eb9f39286b92"
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
      if (info.accepted && info.accepted.length > 0) {
        mailSent = true;
        console.log("Mail inviata correttamente:", info);
      }
    } catch (mailErr) {
      console.error("Errore nell'invio mail:", mailErr);
    }

    if (!mailSent) {

      return res.status(500).json({ error: "Invio email fallito, registrazione annullata" });
    }

   await pool.query(
  `INSERT INTO public.users (username, password, email, telefono, ruolo, azienda) 
   VALUES ($1, $2, $3, $4, $5, $6)`,
  [societa, hashedPassword, pec, telefono, 'amministratore', societa]
);


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
    const username = req.user.userId; 

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
    const username = req.user.userId; // qui userId è lo username salvato nel token
    const result = await pool.query('SELECT azienda FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Utente non trovato" });
    return res.json({ azienda: result.rows[0].azienda });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore server" });
  }
});

module.exports = router;
