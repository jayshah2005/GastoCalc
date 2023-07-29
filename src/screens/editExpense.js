import {
  View,
  Text,
  StyleSheet,
  StatusBar
} from "react-native";
import Input from "../components/input";
import SmallButton from "../components/smallButton";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { getCategory } from "../function/categoriesFetcher";
import { useEffect } from "react";
import { db } from "../function/openDatabase";

const EditExpense = ({ route, navigation }) => {

  const { item } = route.params;
  const [Category, setCategory] = useState(item.category);
  const [Name, setName] = useState(item.name);
  const [Amount, setAmount] = useState((item.amount).toString());
  const [categories, setCategories] = useState([]);
  
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
  
  const Delete = () => {
    // Delete an expense in the data
    console.log(item.date)
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
      navigation.goBack()
    } catch (error) {
      console.log("Error while editing the data: ", error);
    }
  }

  const edit = () => {
    try{
      db.transaction((tx) => {
        tx.executeSql("UPDATE expenses SET name=(?), amount=(?), category=(?) WHERE date=(?)",
        [Name, Amount, Category, item.date],
        () => {
          console.log("Changes made sucessfully")
        }, 
        (error) => {
          console.log("Error occured: ",error)
        })
      })
      navigation.goBack()
    } catch(error) {
      console.log("Could not update the data")
    }
  }
  
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
        </View>
  
        <View style={styles.buttonView}>
          <SmallButton text={'Edit'} onPress={edit} color={'lightgreen'} underlayColor="#65E765" />
          <SmallButton text={'Delete'} onPress={Delete} color={'#FF1A1A'} underlayColor="#E60000" />
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

  buttonView : {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'flex-end',
  flexDirection: 'row',
  paddingBottom: 25
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
