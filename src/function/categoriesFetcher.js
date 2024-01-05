import { db } from "./openDatabase.js";

let category = [];

function getCategory() {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT name FROM category",
          [],
          (_, result) => {
            if (result.rows._array.length > 0) {
              category = result.rows._array.map((item) => item.name);
            }
            // Checks if Miscellaneous is already in the array and if not adds it
            if (!category.includes("Miscellaneous")) {
              category.push("Miscellaneous");
            }
            resolve(category);
          },
          (error) => {
            console.log("Error executing SQL statement:", error);
            reject(error);
          }
        );
      });
    } catch (error) {
      console.log("Error retrieving data from categories.db ", error);
      reject(error);
    }
  });
}

export { getCategory };
