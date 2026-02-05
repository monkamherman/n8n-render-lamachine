const { Client } = require("pg");

// Test de connexion à la base de données en production
async function testProductionDB() {
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://postgres:YjxBJtgTwSlBxnSQ@db.kbeseafmtepfjatzvjnr.supabase.co:5432/postgres",
    connectionTimeoutMillis: 60000,
    idleTimeoutMillis: 30000,
  });

  try {
    console.log("🔗 Test de connexion à la base de données en production...");
    await client.connect();
    console.log("✅ Connexion réussie!");

    // Vérifier les tables n8n
    console.log("\n📊 Vérification des tables n8n:");
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%n8n%' OR table_name LIKE '%execution%' OR table_name LIKE '%workflow%'
      ORDER BY table_name
    `);

    console.log("📚 Tables n8n trouvées:");
    tablesResult.rows.forEach((row) => {
      console.log(`  - ${row.table_name}`);
    });

    // Test de requête simple
    console.log("\n⚡ Test de performance:");
    const start = Date.now();
    await client.query("SELECT 1");
    const end = Date.now();
    console.log(`✅ Temps de réponse: ${end - start}ms`);

    // Vérifier la version
    const versionResult = await client.query("SELECT version()");
    console.log(
      `📦 Version PostgreSQL: ${versionResult.rows[0].version.split(",")[0]}`,
    );

    console.log("\n🎉 Test de base de données réussi!");
    return true;
  } catch (error) {
    console.error("❌ Erreur de connexion:", error.message);
    console.error("Code d'erreur:", error.code);
    console.error("Détails:", error);
    return false;
  } finally {
    await client.end();
    console.log("🔌 Connexion fermée");
  }
}

// Test si ce fichier est exécuté directement
if (require.main === module) {
  testProductionDB();
}

module.exports = { testProductionDB };
