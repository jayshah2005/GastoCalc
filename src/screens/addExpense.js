import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Switch,
  SafeAreaView,
} from "react-native";
import Input from "../components/input";
import SmallButton from "../components/smallButton";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { db } from "../function/openDatabase";
import { getCategory } from "../function/categoriesFetcher";
import { useEffect } from "react";
import {
  setRecurringDate,
  setRecurringExpense,
} from "../function/recurringExpenses";

// Main component which will be called from outside
const AddExpense = ({ navigation }) => {
  const [Category, setCategory] = useState("");
  const [Name, setName] = useState("");
  const [Amount, setAmount] = useState("");
  const [categories, setCategories] = useState([]);
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState("");

  useEffect(() => {
    setRecurringInterval(toggleSwitch ? "Daily" : "");
  }, [toggleSwitch]);

  // Used for hiding the bottom tabs
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
      },
    });
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  }, [navigation]);

  // Fetching categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryArray = await getCategory();
        setCategories(categoryArray);
      } catch (error) {
        console.log("Error retrieving data from categories.db", error);
      }
    };
    fetchCategories();
  }, []);

  // Function executed to clear input feilds when the user clicks on the reset button
  const Reset = () => {
    setName("");
    setAmount("");
    setCategory("");
  };

  // Function to be executed once we get input from the user about the expense/Inserting an expense record
  const Add = () => {
    // Checking if the user provided proper information, if true then adding it to expenses.db
    if (!(Name === "" || Name == null || Amount == null || Category == "")) {
      // Check if amount entered is positive
      if (Amount < 0) {
        Alert.alert("Please enter proper amount.");
        return;
      }

      // Adding the transaction using an SQL query
      try {
        // Checks if the expense is set to be recurring, if it is then does the needfull
        if (toggleSwitch) {
          const date = new Date();
          const recurrenceDate = setRecurringDate(recurringInterval, date);

          let expense = {
            Name: Name,
            Amount: Amount,
            Category: Category,
            recurringInterval: recurringInterval,
            recurrencedate: recurrenceDate,
          };

          console.log(expense)
          
          setRecurringExpense(expense);
        }

        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO expenses (name, amount, category) VALUES (?, ?, ?)",
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
      } catch (error) {
        console.log("Error adding data: ", error);
      }

      navigation.goBack();
    } else {
      Alert.alert("Please enter all the information properly.");
    }
  };

  console.log(recurringInterval);

  const [placeholderview, setPlaceholderview] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
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
            onFocus={() => setPlaceholderview(false)}
            onBlur={() => setPlaceholderview(true)}
          >
            {placeholderview && (
              <Picker.Item label="-----Click to select-----" value="" />
            )}

            {categories.map((item, index) => {
              return <Picker.Item label={item} value={item} key={index} />;
            })}
          </Picker>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.inputText}>Recuring Expense</Text>
          <Switch
            thumbColor={toggleSwitch ? "lightgreen" : "white"}
            onValueChange={() => setToggleSwitch(!toggleSwitch)}
            value={toggleSwitch}
          />
        </View>

        {toggleSwitch ? (
          <View style={styles.switchBorder}>
            <Picker
              selectedValue={recurringInterval}
              onValueChange={(itemValue, itemIndex) =>
                setRecurringInterval(itemValue)
              }
              style={styles.input}
            >
              <Picker.Item label="Daily" value={"Daily"} />
              <Picker.Item label="Monthly" value={"Monthly"} />
              <Picker.Item label="Yearly" value={"Yearly"} />
              <Picker.Item label="10sec" value={"10sec"} />
            </Picker>
          </View>
        ) : (
          <View></View>
        )}
      </View>

      <SafeAreaView style={styles.buttonView}>
        <SmallButton
          text={"ADD"}
          onPress={Add}
          color={"lightgreen"}
          underlayColor="#65E765"
        />
        <SmallButton
          text={"Reset"}
          onPress={Reset}
          color={"lightgrey"}
          underlayColor="#B3B3B3"
        />
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default AddExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },

  buttonView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "row",
    paddingBottom: 25,
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

  // Styles for Toggle Switch
  switchContainer: {
    flexDirection: "row",
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 10,
  },

  switchBorder: {
    borderWidth: 1,
    height: 40,
    width: 240,
    marginTop: 10,
  },
});
