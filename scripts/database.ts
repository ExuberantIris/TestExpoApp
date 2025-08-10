import * as SQLite from "expo-sqlite";

//Connection is initialised globally
const db = SQLite.openDatabaseSync("storage.db");

/**
 * If you have a existing database this is where you would import it,
 * otherwise this is where you would create tables and seed DB.
 */
export function initDatabase(db: SQLite.SQLiteDatabase) {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, storeDate TEXT NOT NULL, expireDate TEXT NOT NULL)
    `);
}

export default db;