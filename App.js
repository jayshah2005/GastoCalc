import { StyleSheet } from "react-native";
import { useEffect } from "react";
import AddExpense from "./src/screens/addExpense";
import Expenses from "./src/screens/expenses";
import EditScreen from "./src/screens/editExpense";
import EditRecurringExpense from "./src/screens/editRecurringExpense";
import Overview from "./src/screens/overview";
import { updateRecurringExpenses } from "./src/function/recurringExpenses";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Home() {
  useEffect(() => {
    const interval = setInterval(async () => {
      await updateRecurringExpenses();
    }, 10000);

    return () => clearInterval(interval); // Clear the interval when the component unmounts
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Expenses" component={Expenses} />
      <Stack.Screen name="Edit" component={EditScreen} />
      <Stack.Screen name="AddExpense" component={AddExpense} />
    </Stack.Navigator>
  );
}

function SecondScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Overview" component={Overview} />
      <Stack.Screen name="Edit" component={EditRecurringExpense} />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            tabBarActiveTintColor: "darkgreen",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="piggy-bank-outline"
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="SecondScreen"
          component={SecondScreen}
          options={{
            headerShown: false,
            tabBarActiveTintColor: "darkgreen",
            tabBarIcon: ({ color }) => (
              <Feather name="pie-chart" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
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
