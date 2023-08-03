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

const getExpensesOfMonth = (inputmonth) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(inputmonth).padStart(2, '0'); // Add leading zero if month is single-digit
  const startDate = year + `-` + month + `-01 00:00:00`;
  const endDate = year + `-` + month + `-31 00:00:00`;; 

  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT name, amount, category, date FROM expenses WHERE date BETWEEN (?) AND date (?)",
          [startDate.toString(), endDate.toString()],
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

const getExpensesOfYear = () => {
  const date = new Date();
  const year = date.getFullYear();
  const startDate = year + `-` + '00' + `-01 00:00:00`;
  const endDate = year + `-` + '00' + `-31 00:00:00`;; 

  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT name, amount, category, date FROM expenses WHERE date BETWEEN (?) AND date (?)",
          [startDate.toString(), endDate.toString()],
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

export { getExpenses, getExpensesOfMonth };
