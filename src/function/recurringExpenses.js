import { db } from "./openDatabase";

function setRecurringExpense(expense) {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO rexpenses (name, amount, category, recurrencedate, recurringInterval) VALUES (?, ?, ?, ?, ?)",
        [
          expense.Name,
          parseFloat(expense.Amount),
          expense.Category,
          expense.recurrencedate.toISOString(),
          expense.recurringInterval,
        ],
        (_, { rowsAffected, insertId }) => {
          console.log("Expense record inserted with ID in rexpenses:", {
            insertId,
          });
        },
        (_, error) => {
          console.log("Error inserting rexpense record:", error);
        }
      );
    });
  } catch (error) {
    console.log("Error adding data: ", error);
  }
}

function getRecurringExpense() {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT name, amount, category, recurrencedate, recurringInterval, startdate FROM rexpenses",
          [],
          (_, result) => {
            resolve(result.rows._array);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    } catch (error) {
      console.log("Error retrieving recurring expenses: ", error);
    }
  });
}

function setRecurringDate(recurringInterval, date) {
  let recurrenceDate;

  if (recurringInterval === "Daily") {
    recurrenceDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  } else if (recurringInterval === "Monthly") {
    recurrenceDate = new Date(date.getTime());
    recurrenceDate.setMonth(date.getMonth() + 1);
  } else if (recurringInterval === "Yearly") {
    recurrenceDate = new Date(date.getTime());
    recurrenceDate.setFullYear(date.getFullYear() + 1);
  } else if (recurringInterval === "10sec") {
    recurrenceDate = new Date(date.getTime() + 10 * 1000);
  }

  return recurrenceDate;
}

async function updateRecurringExpenses() {
  const rawData = await getRecurringExpense();
  const date = new Date();

  await rawData.forEach((rexpense) => {
    let expense = rexpense;

    while (new Date(expense.recurrencedate) <= date) {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO expenses (name, amount, category, date) VALUES (?, ?, ?, ?)",
            [
              expense.name,
              expense.amount,
              expense.category,
              expense.recurrencedate,
            ],
            (_, { rowsAffected, insertId }) => {
              if (rowsAffected > 0) {
                console.log(
                  "Recurring Expense record inserted with ID:",
                  insertId
                );
              }
            },
            (_, error) => {
              console.log("Error inserting recurring expense record:", error);
            }
          );
        });

        if (new Date(expense.recurrencedate) > date) {
          break;
        }
      } catch (error) {
        console.log("Error adding data: ", error);
      }

      // Update recurrence date in the temporary variable
      expense.recurrencedate = setRecurringDate(
        expense.recurringInterval,
        new Date(expense.recurrencedate)
      ).toISOString();
    }

    // Finalizing the results to the database
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE rexpenses SET recurrenceDate = (?) WHERE startdate = (?)",
          [expense.recurrencedate, expense.startdate],
          () => {
            console.log("Changes made sucessfully in rexpenses");
          },
          (error) => {
            console.log(
              "Error occured while editing data in rexpenses: ",
              error
            );
          }
        );
      });
    } catch (error) {
      console.log("Could not update the data in rexpenses");
    }
  });
}

export {
  setRecurringExpense,
  getRecurringExpense,
  setRecurringDate,
  updateRecurringExpenses,
};
