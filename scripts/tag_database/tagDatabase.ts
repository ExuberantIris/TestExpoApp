import * as SQLite from "expo-sqlite";
//Connection is initialised globally
const tagDB = SQLite.openDatabaseSync("tag.db");
const _localVar = SQLite.openDatabaseSync("globalTagDBVar.db")
/**
 * If you have a existing database this is where you would import it,
 * otherwise this is where you would create tables and seed DB.
 */
export function initTagDatabase(db: SQLite.SQLiteDatabase) {
  _localVar.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS sth (
      anyway INTERGER
    );
  `);
  
  const value = _localVar.getFirstSync("SELECT * FROM sth")
  if (value === null) {
    db.execSync(`
      DROP TABLE IF EXISTS tag;
    `);
  }

  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tag (
      tagID INTEGER PRIMARY KEY NOT NULL UNIQUE,
      name TEXT NOT NULL,
      parentID INTERGER
    );
  `);
  _localVar.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS sth (
      anyway INTERGER
    );
  `);

  if (value === null) {
    db.execSync(`
      INSERT INTO tag (name) 
      VALUES ("冷凍"), ("冷藏"), ("蔬果冷藏");
    `);
    _localVar.runSync(`INSERT INTO sth VALUES(1)`)
  }
}
export default tagDB;