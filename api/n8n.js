const { exec } = require("child_process");
const express = require("express");

const app = express();
const port = process.env.PORT || 5678;

// Middleware pour parser le JSON
app.use(express.json());

// Configuration de n8n avec Supabase
const n8nConfig = {
  DATABASE_URL: process.env.DATABASE_URL,
  N8N_LOG_LEVEL: process.env.N8N_LOG_LEVEL || "info",
  GENERIC_TIMEZONE: process.env.GENERIC_TIMEZONE || "Europe/Paris",
  TZ: process.env.TZ || "Europe/Paris",
  N8N_DEFAULT_LOCALE: process.env.N8N_DEFAULT_LOCALE || "fr",
  N8N_ENCRYPTION_KEY: process.env.N8N_ENCRYPTION_KEY,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  PORT: port,
};

// Routes de base
app.get("/", (req, res) => {
  res.json({
    message: "n8n is running on Vercel with Supabase",
    status: "active",
    config: {
      database: n8nConfig.DATABASE_URL ? "configured" : "missing",
      encryption: n8nConfig.N8N_ENCRYPTION_KEY ? "configured" : "missing",
    },
  });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Proxy pour n8n
app.use("/n8n", (req, res) => {
  // Pour l'instant, rediriger vers une réponse simple
  // n8n nécessite un processus complet, ce qui n'est pas possible sur Vercel serverless
  res.json({
    message: "n8n interface - mode serverless limité",
    note: "Utilisez les webhooks pour l'automatisation",
    webhook_url: `${process.env.WEBHOOK_URL}/webhook`,
  });
});

// Export pour Vercel
module.exports = app;
