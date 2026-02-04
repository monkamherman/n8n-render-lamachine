const { Client } = require("pg");

// Configuration de la base de données
const dbConfig = {
  connectionString:
    "postgresql://postgres:YjxBJtgTwSlBxnSQ@db.kbeseafmtepfjatzvjnr.supabase.co:5432/postgres",
};

async function testDatabase() {
  const client = new Client(dbConfig);

  try {
    console.log("🔗 Connexion à la base de données...");
    await client.connect();
    console.log("✅ Connexion réussie!");

    // Test 1: Vérifier la version de PostgreSQL
    console.log("\n📊 Test 1: Version PostgreSQL");
    const versionResult = await client.query("SELECT version()");
    console.log("Version:", versionResult.rows[0].version);

    // Test 2: Créer une table de test
    console.log("\n🏗️  Test 2: Création table de test");
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        test_time TIMESTAMP DEFAULT NOW(),
        message TEXT
      )
    `);
    console.log("✅ Table test_connection créée/vérifiée");

    // Test 3: Insérer des données
    console.log("\n📝 Test 3: Insertion de données");
    const insertResult = await client.query(
      `
      INSERT INTO test_connection (message) 
      VALUES ($1) 
      RETURNING id, test_time
    `,
      ["Test de connexion depuis Node.js"],
    );
    console.log("✅ Données insérées:", insertResult.rows[0]);

    // Test 4: Lire les données
    console.log("\n📖 Test 4: Lecture des données");
    const selectResult = await client.query(`
      SELECT * FROM test_connection 
      ORDER BY test_time DESC 
      LIMIT 5
    `);
    console.log("📋 Derniers tests:");
    selectResult.rows.forEach((row) => {
      console.log(
        `  - ID: ${row.id}, Heure: ${row.test_time}, Message: ${row.message}`,
      );
    });

    // Test 5: Vérifier les tables existantes (pour n8n)
    console.log("\n🗂️  Test 5: Tables existantes");
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log("📚 Tables dans la base:");
    tablesResult.rows.forEach((row) => {
      console.log(`  - ${row.table_name}`);
    });

    // Test 6: Test de performance
    console.log("\n⚡ Test 6: Performance");
    const start = Date.now();
    await client.query("SELECT 1");
    const end = Date.now();
    console.log(`✅ Temps de réponse: ${end - start}ms`);

    console.log("\n🎉 Tous les tests passés avec succès!");
  } catch (error) {
    console.error("❌ Erreur lors du test:", error.message);
    console.error("Détails:", error);
  } finally {
    await client.end();
    console.log("🔌 Connexion fermée");
  }
}

// Test de connexion simple
async function quickTest() {
  const client = new Client(dbConfig);

  try {
    console.log("🚀 Test rapide de connexion...");
    await client.connect();
    const result = await client.query(
      "SELECT NOW() as current_time, version() as version",
    );
    console.log("✅ Connexion réussie!");
    console.log("⏰ Heure du serveur:", result.rows[0].current_time);
    console.log("📦 Version:", result.rows[0].version.split(",")[0]);
  } catch (error) {
    console.error("❌ Erreur de connexion:", error.message);
  } finally {
    await client.end();
  }
}

// Menu principal
const args = process.argv.slice(2);
if (args.includes("--quick")) {
  quickTest();
} else {
  testDatabase();
}
