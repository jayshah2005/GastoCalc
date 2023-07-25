import { db } from "./openDatabase";

const getExpenses = () => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT name, amount, category, date FROM expenses",
          [],
          (_, result) => {
            const rows = result.rows._array;
            resolve(rows); // Resolve the Promise with the retrieved data
          },
          (_, error) => {
            reject(error); // Reject the Promise if an error occurs
          }
        );
      });
    } catch (error) {
      reject(error); // Reject the Promise if an error occurs
    }
  });
};

export { getExpenses };
