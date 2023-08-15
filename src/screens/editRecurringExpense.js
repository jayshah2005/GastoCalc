import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  StatusBar,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Input from "../components/input";
import SmallButton from "../components/smallButton";
import React, { useEffect, useState } from "react";
import { db } from "../function/openDatabase";
import { setRecurringDate } from "../function/recurringExpenses";
import { useCategoriesContext } from "../contextAPI/globalVariables";

const EditRecurringExpense = ({ route, navigation }) => {
  const { item } = route.params;
  const [Category, setCategory] = useState(item.category);
  const [Name, setName] = useState(item.name);
  const [Amount, setAmount] = useState(item.amount.toString());
  const [recurringInterval, setRecurringInterval] = useState(
    item.recurringInterval
  );

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
    Alert.alert("Delete", "Are you sure you want to delete this recurring expense?", [
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
          "DELETE FROM rexpenses WHERE startdate=(?)",
          [item.startdate],
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
    const date = new Date();
    const recurrenceDate = setRecurringDate(recurringInterval, date);
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE rexpenses SET name=(?), amount=(?), category=(?), recurringInterval=(?), recurrencedate=(?) WHERE startdate=(?)",
          [
            Name,
            Amount,
            Category,
            recurringInterval,
            recurrenceDate.toISOString(),
            item.startdate,
          ],
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
          >
            {categories.map((item, index) => {
              return <Picker.Item label={item} value={item} key={index} />;
            })}
          </Picker>
        </View>

        <Text style={styles.inputText}>Recuring Expense</Text>

        <View style={styles.inputBorder}>
          <Picker
            selectedValue={recurringInterval}
            onValueChange={(itemValue, itemIndex) =>
              setRecurringInterval(itemValue)
            }
            style={styles.input}
          >
            <Picker.Item label="Daily" value={"Daily"} />
            <Picker.Item label="Weekly" value={"Weekly"} />
            <Picker.Item label="Monthly" value={"Monthly"} />
            <Picker.Item label="Yearly" value={"Yearly"} />
            <Picker.Item label="10sec" value={"10sec"} />
          </Picker>
        </View>
      </View>
      <Text style={styles.note}>Note that any changes made to the recurring expense will only take effect on the next recurring date.</Text>

      <SafeAreaView style={styles.buttonView}>
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
      </SafeAreaView>
    </SafeAreaView>
  );
};

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
    padding: 5,
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

  note: {
    color: 'red',
    alignSelf: 'center',
    paddingHorizontal: 65,
    paddingTop: 20,
    textAlign: 'center'
  }
});

export default EditRecurringExpense;
