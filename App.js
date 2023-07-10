import { StyleSheet, View, Text } from 'react-native'; 
import AddExpense from './src/screens/addExpense'

const App = () => {
  return (
    <AddExpense />
  );
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
