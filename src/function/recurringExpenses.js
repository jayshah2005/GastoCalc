import { db } from "./openDatabase"


function setRecurringExpense (expense) {

    try {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO rexpenses (name, amount, category, recurrencedate, repeattype) VALUES (?, ?, ?, ?, ?)',
                [
                  expense.Name,
                  parseFloat(expense.Amount),
                  expense.Category,
                  expense.recurranceDate.toISOString(),
                  expense.recurringInterval            
                ],
                (_, { rowsAffected, insertId }) => {
                    console.log("Expense record inserted with ID in rexpenses:", { insertId });
                },
                (_, error) => {
                console.log("Error inserting rexpense record:", error);
                }
            );
        });
    } catch(error) {
        console.log('Error adding data: ', error)
    }
}

function getRecurringExpense() {
    return new Promise((resolve, reject) => {
        try {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT name, amount, category, recurrencedate, repeattype FROM rexpenses",
                    [],
                    (_, result) => {
                        resolve(result.rows._array)
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            })
        } catch(error) {
            console.log("Error retrieving recurring expenses: ", error)
        }
    })
}

function setRecurringDate (recurringInterval, date) {

    let recurranceDate = new Date(date.getTime());

        if (recurringInterval === 'Daily') {
            recurranceDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        } else if (recurringInterval === 'Monthly') {
            recurranceDate = new Date(date.getTime());
            recurranceDate.setMonth(date.getMonth() + 1);
        } else {
            recurranceDate = new Date(date.getTime());
            recurranceDate.setFullYear(date.getFullYear() + 1);
        }
    
    return recurranceDate

}

function checkIfDued (expense) {
    if (recurrenceDate <= date) {
        return true
      }
}

async function updateRecurringExpenses() {

    const rawData = await getRecurringExpense()
    const date = new Date()
    console.log(rawData)
    rawData.map((expense) => {

        const recurrenceDate = new Date(expense.recurrenceDate)
    
    })
    
}

export {setRecurringExpense, getRecurringExpense, setRecurringDate, updateRecurringExpenses}