import { db } from "./openDatabase.js";

let category = ["Food", "Rent", "Fuel", "Clothes", "Travel"];

try {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)",
      [],
      () => {
        console.log("Category table created successfully.");
      },
      (error) => {
        console.log("Error creating category table:", error);
      }
    );
  });
} catch (error) {
  console.log("Error executing SQL statement in category.js:", error);
}

function getCategory() {
  try {
    db.transaction((tx) => {
      tx.executeSql("SELECT name FROM category"),
        [],
        (_, { rows: { _array } }) => {
          if (_array != []) {
            category.push(_array);
          }
        };
    });
  } catch (error) {
    console.log("Error retrieving data from categories.db");
  }

  // Checks if Miscellaneous is already in the array and if not adds it
  if (!category.includes("Miscellaneous")) {
    category.push("Miscellaneous");
  }

  console.log(JSON.stringify(category));

  return category;
}

export { getCategory };
