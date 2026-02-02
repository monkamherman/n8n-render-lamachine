const { exec } = require("child_process");
const express = require("express");

const app = express();
const port = process.env.PORT || 5678;

// Configuration de n8n avec Supabase
const n8nConfig = {
  DB_TYPE: process.env.DB_TYPE || "postgresdb",
  DB_POSTGRESDB_HOST: process.env.DB_POSTGRESDB_HOST,
  DB_POSTGRESDB_DATABASE: process.env.DB_POSTGRESDB_DATABASE,
  DB_POSTGRESDB_PORT: process.env.DB_POSTGRESDB_PORT || 5432,
  DB_POSTGRESDB_USER: process.env.DB_POSTGRESDB_USER,
  DB_POSTGRESDB_PASSWORD: process.env.DB_POSTGRESDB_PASSWORD,
  N8N_LOG_LEVEL: process.env.N8N_LOG_LEVEL || "info",
  GENERIC_TIMEZONE: process.env.GENERIC_TIMEZONE || "Europe/Paris",
  TZ: process.env.TZ || "Europe/Paris",
  N8N_DEFAULT_LOCALE: process.env.N8N_DEFAULT_LOCALE || "fr",
  N8N_ENCRYPTION_KEY: process.env.N8N_ENCRYPTION_KEY,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  PORT: port,
};

// Démarrer n8n
app.get("/", (req, res) => {
  res.send("n8n is running on Vercel with Supabase");
});

app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

// Export pour Vercel
module.exports = app;
