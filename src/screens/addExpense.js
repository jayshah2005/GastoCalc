import { View, Text, Pressable, StyleSheet, StatusBar } from "react-native";
import Input from "../../src/components/input";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";

const AddExpense = () => {
  const [Category, setCategory] = useState("None");
  const [Name, setName] = useState("");
  const [Amount, setAmount] = useState("");

  // Function to be executed once we get input from the user about the expense
  const Add = () => {
    console.log("Input 1:", Name);
    console.log("Input 2:", Amount);
    console.log("Input 3", Category);
  };

  return (
    <View style={styles.container}>
      <Text>GastoCalc</Text>

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
            style={styles.input}
          >
            <Picker.Item label="Food" value="food" />
            <Picker.Item label="Rent" value="rent" />
            <Picker.Item label="Fuel" value="fuel" />
            <Picker.Item label="Miscellaneous" value="mics" />
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
});
