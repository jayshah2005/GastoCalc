import * as SQLite from "expo-sqlite";

function openDatabase(dbName) {
  let db;
  if (Platform.OS === "web") {
    db = openDatabase({name: dbName, location: 'default'});
  } else {
  db = SQLite.openDatabase(dbName);
  }
  return db;
}

const db = openDatabase("GastoCalc.db");

export { openDatabase, db };
