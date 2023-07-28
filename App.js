import { StyleSheet } from "react-native";
import AddExpense from "./src/screens/addExpense";
import HomeScreen from "./src/screens/homeScreen";
import EditScreen from "./src/screens/editExpense"
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator()

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name='Edit' component={EditScreen} />
        <Stack.Screen name="AddExpense" component={AddExpense} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
