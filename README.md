# CS50 Final Project - GastoCalc
 
GastoCalc is an App used for tracking expenses and getting a better idea of your spending habits.
 
## Introduction
 
My name is Jay Atul Shah. I am a high school graduate and, will be starting my computer science degree at Brock University as an international student this fall(2023). For the first time, I am going to find a part-time job and live alone, away from my home. This means I need to be more conscious of my spending habits and keep track of my expenses. This thought process led me to make GastoCalc, an app used to do just that, as a part of my final project for CS50.
 
This app was created using the following resources:
 
- React Native, along with various third-party libraries
- Sqlite is used for creating local storage inside the device.
- Figma and Canvas for the splash screen and app icon respectively.

### .APK File Download: <https://link-target.net/220726/gastocalc-app> 

### Video Demo: <https://youtu.be/V32zcLIk4EI>
 
 
## Set-up
 
### OpenDatabase (function/openDatabase.js)
 
When the app starts, it establishes a database connection to GastoCalc.db. There, it checks and creates three tables if they do not exist:
 
- expenses (used to store all the expenses)
- rexpenses (used to store all the recurring expenses)
- category (used to store the names of categories for all the expenses)
 
When a category table is created for the first time, it prepopulates the table with some default categories. It then passes the database component (db) as a variable to other files.
 
### Global Variables (contextAPI/globalVariables.js)
 
We create a new context for passing the updated category list to all components. These categories are fetched using the getCategory function (function/categoriesFetcher). In the end, we have a global variable, categories, which can be accessed throughout the app.
 
 
## Expense Screen (screens/expenses.js)
 
It is the first screen that loads up when you start the app. It is a simple screen that renders all the previous expenses retrieved from the expenses table using the getExpenses function (function/expensesTable.js) in the form of a section list and contains a button to add new expenses to this list. The expenses are shown based on month and year, with the most recent expense shown first. During the time the function gets all the expenses and renders a section list, a loading component is shown (components/loadingText.js). Clicking on an item/expense on the list allows you to edit or delete that entry. Clicking on 'Add Expense' redirects to a different screen where you can add an expense.
  
### Add Expense (screens/addExpense.js)
 
This screen adds expenses to the list. It contains input fields (components/input.js) where you can add the name and the amount spent on a particular thing. Further, A picker component is used to select one of the categories fetched using the context API (contextAPI/globalVariables.js).
 
To add a recurring expense, you can select the switch component, which renders another picker component used to select the interval of the recurring expense.
 
Finally, the add and reset buttons implement self-explanatory functionality using the small button component (components/smallButton.js).
 
### Edit Expense (screens/editExpense.js)
 
The edit screen allows editing of an expense from the expense table. To access the screen, click on any expense within the expenses screen. The edit screen is similar to the addExpense screen but prepopulated with the data for the selected expense. It also includes a delete button (components/smallButton.js) to remove the entry from the expense table.
 
## Overview (screens/overview.js)
 
This screen shows an overview of the current month's expenses in the form of a donut chart (components/donutGraph.js) along with a sectionlist of all the recurring expenses. It also shows how your current month's expenses compare to the last month's using the data fetched from the getExpensesOfMonth function (function/expensesTable.js). As the donut graph loads, it renders a loading text component (components/loadingText.js).
 
The section list displays recurring expenses fetched from the recurring expense table using the getRecurringExpense function (function/recurringExpenses.js). Expenses are sorted by the date they will occur, i.e., the recurring date, with the nearest date at the top. Clicking on an item/expense on the list allows you to edit or delete that entry. 
 
### Donut Graph (components/donutGraph.js)
 
The current month's expenses are fetched using the getExpensesOfMonth function (function/expensesTable.js) from the expenses table. Then this data is arranged into a donut graph based on the category of expenditure using all the categories present in the categories variable fetched using the context API (contextAPI/globalVariables.js). The graph is created by printing an SVG element for each category.
 
A list of all the categories is displayed along with the total amount spent on that particular category in the form of a number and percentage beside the graph. Below the graph, the total expense for the month is shown.
 
### Edit Screen For Recurring Expense (screens/editRecurringExpense.js)
 
This screen is the same as the addExpense screen, minus a few minor changes. Firstly, the switch component is no longer present since we are only editing recurring expenses through this screen. To access the screen, click on any recurring expense within the sectionlist in the overview screen. The screen also loads up with already-filled input fields from the item/expense selected.

# This Was CS50!