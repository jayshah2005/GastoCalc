import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import Input from "../components/input";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import * as SQLite from "expo-sqlite";
import { openDatabase } from "../function/openDatabase";
import { getCategory } from "../function/categoriesFetcher"


let categories = getCategory()

// Opening/Creating a database and table in it
const db = openDatabase("GastoCalc.db");
try {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount REAL, category TEXT)",
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

// Main component which will be called from outside
const AddExpense = () => {
  const [Category, setCategory] = useState("");
  const [Name, setName] = useState("");
  const [Amount, setAmount] = useState("");

  // Function to be executed once we get input from the user about the expense/Inserting an expense record
  const Add = () => {
    console.log("Input 1:", Name);
    console.log("Input 2:", Amount);
    console.log("Input 3", Category);

    // Checking if the user provided proper information, if true then adding it to expenses.db
    if (!(Name === "" || Name == null || Amount == null || Category == "")) {
      // Check if amount entered is positive
      if (Amount < 0) {
        Alert.alert("Please enter proper amount.");
        return;
      }

      // Adding the transaction using an SQL query
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO expenses (Name, Amount, Category) VALUES (?, ?, ?)",
          [Name, Amount, Category],
          (_, { rowsAffected, insertId }) => {
            if (rowsAffected > 0) {
              console.log("Expense record inserted with ID:", { insertId });
            }
          },
          (_, error) => {
            console.log("Error inserting expense record:", error);
          }
        );
      });

      // Clearing all inputs to null
      setName("");
      setAmount("");
      setCategory("");
    } 
    else {
      Alert.alert("Please enter all the information properly.");
    }
  };

  const [placeholderview, setPlaceholderview] = useState(true);

  return (
    <View style={styles.container}>
      

      <Input
        text={"Name Of Expense"}
        placeholder={"What did you spend on?"}
        multiline={false}
        value={Name}
        onChangeText={(text) => setName(text)}
      />
      <Input
        text={"Expense Amount"}
        placeholder={"₹ ??"}
        inputMode={"numeric"}
        value={Amount}
        onChangeText={(text) => setAmount(text)}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>Category Of Expense</Text>

        <View style={styles.inputBorder}>
          <Picker
            // Updating category mutable variable everytime a new option is selected
            selectedValue={Category}
            onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
            style={[
              styles.input,
              Category === "" ? styles.placeholder : styles.picker,
            ]}
            onFocus={ () => setPlaceholderview(false) }
            onBlur={ () => setPlaceholderview(true) }
          >

          {placeholderview && <Picker.Item label="-----Click to select-----" value="" />}

          {categories.map((item, index) => {
              return (<Picker.Item label={item} value={item} key={index}/>) 
          })}

          </Picker>

        </View>
      </View>

      <View style={styles.buttonView}>
        <Pressable style={styles.addButton} onPress={Add}>
          <Text>ADD</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AddExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  addButton: {
    backgroundColor: "lightgreen",
    alignItems: "center",
    justifyContent: "center",
    width: 75,
    height: 30,
  },
  buttonView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 30,
  },

  // Styles for picker tag which will eventually be transferred to a different file.
  input: {
    marginTop: -9,
  },
  inputText: {
    fontSize: 15,
    alignItems: "baseline",
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 15,
  },
  inputBorder: {
    borderWidth: 1,
    height: 40,
    width: 240,
    marginTop: 10,
  },

  // Style for the picker component
  placeholder: {
    color: "grey",
  },
  picker: {
    color: "black",
  },
});
