const { Client } = require("pg");

// Configuration de la base de données depuis les variables d'environnement
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
};

async function checkDatabaseConnection() {
  const client = new Client(dbConfig);

  try {
    console.log("🔗 Vérification de la connexion à la base de données...");
    await client.connect();
    console.log("✅ Connexion réussie!");

    // Vérifier la version de PostgreSQL
    const versionResult = await client.query("SELECT version()");
    console.log(
      "📊 Version PostgreSQL:",
      versionResult.rows[0].version.split(",")[0],
    );

    // Vérifier les tables n8n créées
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log("📚 Tables dans la base:");
    const n8nTables = tablesResult.rows.filter(
      (row) =>
        row.table_name.startsWith("n8n_") ||
        ["workflow_entity", "credentials_entity", "user_entity"].includes(
          row.table_name,
        ),
    );

    if (n8nTables.length > 0) {
      console.log("✅ Tables n8n détectées:");
      n8nTables.forEach((row) => {
        console.log(`  - ${row.table_name}`);
      });
    } else {
      console.log(
        "⚠️  Aucune table n8n détectée. n8n n'a peut-être pas encore initialisé la base de données.",
      );
    }

    // Vérifier s'il y a des données
    const workflowCount = await client.query(
      "SELECT COUNT(*) as count FROM workflow_entity WHERE name IS NOT NULL",
    );
    const userCount = await client.query(
      "SELECT COUNT(*) as count FROM user_entity",
    );

    console.log("📈 Statistiques:");
    console.log(`  - Workflows: ${workflowCount.rows[0].count}`);
    console.log(`  - Utilisateurs: ${userCount.rows[0].count}`);

    console.log(
      "🎉 La base de données est correctement configurée et accessible!",
    );
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log("🔌 Connexion fermée");
  }
}

// Route Express pour vérifier la base de données
function setupDatabaseCheckRoute(app) {
  app.get("/check-db", async (req, res) => {
    const client = new Client(dbConfig);

    try {
      await client.connect();

      const result = await client.query(
        "SELECT NOW() as current_time, version() as version",
      );

      res.json({
        status: "OK",
        database: "connected",
        timestamp: result.rows[0].current_time,
        version: result.rows[0].version.split(",")[0],
        message: "Base de données n8n opérationnelle",
      });
    } catch (error) {
      res.status(500).json({
        status: "ERROR",
        database: "disconnected",
        error: error.message,
        message: "Erreur de connexion à la base de données",
      });
    } finally {
      await client.end();
    }
  });
}

module.exports = { checkDatabaseConnection, setupDatabaseCheckRoute };

// Si le script est exécuté directement
if (require.main === module) {
  checkDatabaseConnection();
}
