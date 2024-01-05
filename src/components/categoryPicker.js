import React from "react";
import { StyleSheet } from "react-native";
import { Picker } from "react-native-web";
import { useCategoriesContext } from "../contextAPI/globalVariables";


// Creating a custom picker component which will be used to select from a list of categories
const CategoryPicker = () => {

    // Fetching all categories and currency being used
    const categories = useCategoriesContext();

    return(
      <View style={styles.inputBorder}>
        <Picker
          // Updating category mutable variable everytime a new option is selected
          selectedValue={Category}
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
          style={styles.input}
        >
          {categories.map((item, index) => {
            return <Picker.Item label={item} value={item} key={index} />;
          })}
        </Picker>
      </View>
    );
}

const styles = StyleSheet.create({
  // Styles for picker tag
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
})