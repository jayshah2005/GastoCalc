import { StyleSheet } from "react-native";
import AddExpense from "./src/screens/addExpense";
import HomeScreen from "./src/screens/homeScreen";
import EditScreen from "./src/screens/editExpense";
import Overview from "./src/screens/overview";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Expenses() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Edit" component={EditScreen} />
      <Stack.Screen name="AddExpense" component={AddExpense} />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Expenses"
          component={Expenses}
          options={{ 
            headerShown: false,
            tabBarActiveTintColor: "darkgreen",
            tabBarIcon: ({color}) => (<MaterialCommunityIcons name="piggy-bank-outline" size={24} color={color} />)
          }}
        />
        <Tab.Screen name="Overview" 
        component={Overview} 
        options={{ 
          tabBarActiveTintColor: "darkgreen",
          tabBarIcon: ({color}) => (<Feather name="pie-chart" size={24} color={color} />)
          }}/>
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
