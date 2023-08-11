import { View, Text, StyleSheet, StatusBar, Alert } from "react-native";
import Input from "../components/input";
import SmallButton from "../components/smallButton";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useEffect } from "react";
import { useCategoriesContext } from "../contextAPI/globalVariables";
import { db } from "../function/openDatabase";

const EditExpense = ({ route, navigation }) => {
  const { item } = route.params;
  const [Category, setCategory] = useState(item.category);
  const [Name, setName] = useState(item.name);
  const [Amount, setAmount] = useState(item.amount.toString());

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
  const categories = useCategoriesContext();

  const showAlert = () => {
    Alert.alert("Delete", "Are you sure you want to delete this expense?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "OK",
        onPress: Delete,
        style: "destructive",
      },
    ]);
  };

  const Delete = () => {
    // Delete an expense in the data
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM expenses WHERE date=(?)",
          [item.date],
          () => {
            console.log("Entry deleted successfully.");
          },
          (error) => {
            console.log("Error deleting entery from expenses table:", error);
          }
        );
      });
      navigation.goBack();
    } catch (error) {
      console.log("Error while editing the data: ", error);
    }
  };

  const edit = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE expenses SET name=(?), amount=(?), category=(?) WHERE date=(?)",
          [Name, Amount, Category, item.date],
          () => {
            console.log("Changes made sucessfully");
          },
          (error) => {
            console.log("Error occured: ", error);
          }
        );
      });
      navigation.goBack();
    } catch (error) {
      console.log("Could not update the data");
    }
  };

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
            style={[styles.input, styles.picker]}
          >
            {categories.map((item, index) => {
              return <Picker.Item label={item} value={item} key={index} />;
            })}
          </Picker>
        </View>
      </View>

      <View style={styles.buttonView}>
        <SmallButton
          text={"Edit"}
          onPress={edit}
          color={"lightgreen"}
          underlayColor="#65E765"
        />
        <SmallButton
          text={"Delete"}
          onPress={showAlert}
          color={"#FF1A1A"}
          underlayColor="#E60000"
        />
      </View>
    </View>
  );
};

export default EditExpense;

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
  },
  inputBorder: {
    borderWidth: 1,
    height: 40,
    width: 240,
    marginTop: 10,
  },

  // Style for the picker component
  picker: {
    color: "black",
  },
});
