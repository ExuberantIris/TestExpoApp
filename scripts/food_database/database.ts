import * as SQLite from "expo-sqlite";
//Connection is initialised globally
const db = SQLite.openDatabaseSync("storageDB.db");
const _localVar = SQLite.openDatabaseSync("globalDBVar.db");
/**
 * If you have a existing database this is where you would import it,
 * otherwise this is where you would create tables and seed DB.
 */
export function initDatabase(db: SQLite.SQLiteDatabase) {
  _localVar.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS sth (
      anyway INTERGER
    );
  `);

  const value = _localVar.getFirstSync("SELECT * FROM sth")
  if (value === null) {
    db.execSync(`
      DROP TABLE IF EXISTS test;
    `);
    _localVar.runSync(`INSERT INTO sth VALUES(1)`)
  } 

  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS test (
      id INTEGER PRIMARY KEY NOT NULL UNIQUE, 
      name TEXT NOT NULL UNIQUE, 
      number INTERGER NOT NULL, 
      storeDate TEXT NOT NULL, 
      expireDate TEXT NOT NULL,
      noteID TEXT NOT NULL,
      storage TEXT
    );
  `);
}
export default db;