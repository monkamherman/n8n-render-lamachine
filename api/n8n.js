require("dotenv").config();
const express = require("express");
const { exec } = require("child_process");
const { setupDatabaseCheckRoute } = require("../check-db-connection");
const { testProductionDB } = require("../test-db-production");

const app = express();
const port = process.env.PORT || 5678;

// Middleware
app.use(express.json());

// Configuration n8n avec Supabase
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
    message: "n8n running on Render with Supabase",
    status: "active",
    n8n_version: "latest",
    config: {
      database: n8nConfig.DATABASE_URL ? "configured" : "missing",
      encryption: n8nConfig.N8N_ENCRYPTION_KEY ? "configured" : "missing",
      webhook_url: n8nConfig.WEBHOOK_URL || "not set",
    },
  });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Route pour le cronjob (keep-alive)
app.get("/keep-alive", (req, res) => {
  console.log("Keep-alive ping received at:", new Date().toISOString());
  res.json({
    message: "Server kept alive",
    timestamp: new Date().toISOString(),
    next_ping: "15 minutes",
  });
});

// Route pour tester la connexion à la base de données
app.get("/test-db", async (req, res) => {
  console.log("Test de base de données demandé à:", new Date().toISOString());
  try {
    const result = await testProductionDB();
    res.json({
      status: result ? "success" : "failed",
      timestamp: new Date().toISOString(),
      database_url: process.env.DATABASE_URL ? "configured" : "missing",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Démarrer n8n en arrière-plan
function startN8n() {
  // Configurer les variables d'environnement pour n8n
  const env = {
    ...process.env,
    N8N_BASIC_AUTH_ACTIVE: "false",
    N8N_HOST: "0.0.0.0",
    N8N_PORT: process.env.PORT || "5678", // Utiliser le même port que le service
    N8N_PROTOCOL: "http",
    WEBHOOK_URL: process.env.WEBHOOK_URL,
    DB_CONNECTION_POOL_SIZE: process.env.DB_CONNECTION_POOL_SIZE || "10",
    DB_CONNECTION_POOL_MIN: process.env.DB_CONNECTION_POOL_MIN || "2",
    DB_CONNECTION_TIMEOUT: process.env.DB_CONNECTION_TIMEOUT || "60000",
  };

  const n8nCommand = `n8n start`;

  console.log("Démarrage de n8n avec la configuration:", {
    DATABASE_URL: env.DATABASE_URL ? "configured" : "missing",
    N8N_PORT: env.N8N_PORT,
    WEBHOOK_URL: env.WEBHOOK_URL,
    DB_CONNECTION_POOL_SIZE: env.DB_CONNECTION_POOL_SIZE,
    DB_CONNECTION_TIMEOUT: env.DB_CONNECTION_TIMEOUT,
  });

  exec(n8nCommand, { env }, (error, stdout, stderr) => {
    if (error) {
      console.error(`n8n start error: ${error}`);
      return;
    }
    console.log(`n8n stdout: ${stdout}`);
    if (stderr) {
      console.error(`n8n stderr: ${stderr}`);
    }
  });
}

// Configurer les routes de vérification de la base de données
setupDatabaseCheckRoute(app);

// Démarrer le serveur Express
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`n8n configuration:`, n8nConfig);

  // Démarrer n8n après un court délai
  setTimeout(() => {
    console.log("Starting n8n...");
    startN8n();
  }, 5000);
});

module.exports = app;
