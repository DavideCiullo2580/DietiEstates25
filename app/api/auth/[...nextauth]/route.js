
//ADRI NON MODIFICARE STO FILE CHE MI HA FATTO DANNARE E LO FARà ANCORA PER MOLTO

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import { Pool } from "pg";
import bcrypt from 'bcryptjs';
import nodemailer from "nodemailer";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "dietiestates25",
  password: "progetto",
  port: 2580,
});

async function saveUserToDB(user) {
  const { name, email } = user;

  const res = await pool.query("SELECT * FROM public.users WHERE email = $1", [email]);
  if (res.rows.length > 0) {
    return res.rows[0];
  }

  const generatedPassword = Math.random().toString(36).slice(-10);
  const hashedPassword = await bcrypt.hash(generatedPassword, 10);

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5fec793739f924",
      pass: "15eb9f39286b92",
    },
  });

  const mailOptions = {
    from: "dietiestates25@noreply.com",
    to: email,
    subject: "Benvenuto su DietiEstates25",
    text: `Ciao ${name}(questo è il tuo username),\n\nGrazie per esserti registrato.\nEcco la tua password temporanea per eventuali accessi manuali:\n\n${generatedPassword}\n\nTi consigliamo di cambiarla al primo accesso.\n\nLo staff di DietiEstates25.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (!info.accepted || info.accepted.length === 0) {
      throw new Error("Email non accettata dal server SMTP");
    }
    console.log("Email inviata con successo:", info);
  } catch (err) {
    console.error("Errore nell'invio della mail:", err);
    throw new Error("Errore invio mail");
  }

  const insertRes = await pool.query(
    `INSERT INTO public.users (username, password, email, telefono, ruolo, azienda)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, hashedPassword, email, null, "utente", null]
  );

  return insertRes.rows[0];
}

const authHandler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({ 
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        await saveUserToDB(user);
        return true;
      } catch (error) {
        console.error("Errore durante la registrazione Google:", error);
        return false;
      }
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});

export async function GET(req, res) {
  return authHandler(req, res);
}

export async function POST(req, res) {
  return authHandler(req, res);
}
