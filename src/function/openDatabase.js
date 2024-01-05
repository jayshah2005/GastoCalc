import * as SQLite from "expo-sqlite";

function openDatabase(dbName) {
  let db;
  if (Platform.OS === "web") {
    db = openDatabase({ name: dbName, location: "default" });
  } else {
    db = SQLite.openDatabase(dbName);
  }

  // Creating or opening a table to store expenses.
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount REAL, category TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP);",
        [],
        () => {
          console.log("expenses table created successfully.");
        },
        (error) => {
          console.log("Error creating expenses table:", error);
        }
      );
    });
  } catch (error) {
    console.log("Error executing SQL statement in addExpense.js:", error);
  }

  // Creating or opening a table to store recurring expenses.
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS rexpenses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount REAL, category TEXT, startdate DATETIME DEFAULT CURRENT_TIMESTAMP, recurrencedate TEXT, recurringInterval TEXT);",
        [],
        () => {
          console.log("rexpenses table created successfully.");
        },
        (error) => {
          console.log("Error creating rexpenses table:", error);
        }
      );
    });
  } catch (error) {
    console.log("Error executing SQL statement in addExpense.js:", error);
  }

  try {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);",
        [],
        () => {
          // Check if the category table is empty
          tx.executeSql(
            "SELECT * FROM category",
            [],
            (_, result) => {
              const { rows } = result;

              if (rows.length === 0) {
                // If the table is empty, insert initial categories
                tx.executeSql(
                  'INSERT INTO category (name) VALUES ("Food"),("Grocerries"),("Fuel"),("Travel"),("Bills"),("Outing"),("Clothes"),("Rent"),("Miscellaneous");',
                  [],
                  () => {
                    console.log(
                      "Category table created and prepopulated successfully."
                    );
                  },
                  (error) => {
                    console.log("Error prepopulating category table:", error);
                  }
                );
              } else {
                console.log("Category table already exists.");
              }
            },
            (error) => {
              console.log("Error checking category table:", error);
            }
          );
        },
        (error) => {
          console.log("Error creating category table:", error);
        }
      );
    });
  } catch (error) {
    console.log("Error executing SQL statement in category.js:", error);
  }

  return db;
}

const db = openDatabase("GastoCalc.db");

export { openDatabase, db };
