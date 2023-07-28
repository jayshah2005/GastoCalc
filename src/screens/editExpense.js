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

const EditExpense = ({ navigation }) => {

  const [Category, setCategory] = useState("");
  const [Name, setName] = useState("");
  const [Amount, setAmount] = useState("");
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
          <SmallButton text={'Edit'} onPress={() => navigation.goBack()} color={'lightgreen'} underlayColor="#65E765" />
          <SmallButton text={'Delete'} onPress={() => navigation.goBack()} color={'#FF1A1A'} underlayColor="#E60000" />
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
