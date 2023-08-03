// HomeScreen.js
import React, { useCallback, useState } from "react";
import {
  View,
  SectionList,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  StatusBar,
} from "react-native";
import { getExpenses } from "../function/expensesTable";
import { useFocusEffect } from "@react-navigation/native";
import { useEffect } from "react";
import LoadingText from '../components/loadingText'

const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const HomeScreen = ({ navigation }) => {
  //Fetching data from expenses table in GastoCalc.db and optimizing it to make it more useable
  const [expenses, setExpenses] = useState([]);
  const [dailyExpense, setDailyExpense] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const rawData = getExpenses()

  // Hook to get data from the database eachtime the screen comes in focus
  useFocusEffect(
    useCallback(() => {
      const fetchdata = async () => {
        let temp = [];
        let groupedDailyExpense = [];
        let groupedMonthlyExpense = [];

        try {
          const rawData = await getExpenses();
          // Temporary array in which we are storing each expense individually
          temp = rawData.map((data) => {
            const key = new Date(data.date);
            return {
              month: month[key.getMonth()] + " " + key.getFullYear(),
              data: [data],
            };
          });

          // Using the temp array to create groupedExpenses where we are storeing data of expenses of each day together
          temp.forEach((piece) => {

            let monthPresent = false;
            let index;

            for (index = 0; index < groupedMonthlyExpense.length; index++) {
              if (groupedMonthlyExpense[index].month === piece.month) {
                monthPresent = true;
                break;
              }
            }

            if (monthPresent) {
              groupedMonthlyExpense[index].data.push(piece.data[0]);
            } else {
              groupedMonthlyExpense.push(piece);
            }
          });

          groupedMonthlyExpense.map((month) => {month.data.reverse()})

          setExpenses(groupedMonthlyExpense.reverse());
          setIsLoading(false)
        } catch (error) {
          console.log("Error retrieving expenses and seprating it:", error);
        }
      };

      fetchdata();
    }, [rawData])
  );

  // Function to calculate the total expense of a given day
  const calculateTotalExpenseOfMonth = (month) => {
    const totalExpense = month.data.reduce((sum, data) => {
      return sum + parseFloat(data.amount);
    }, 0);
    return totalExpense;
  };

  // Render function to render items from the data
  const renderitem = ({ item }) => {
    return (
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="none"
        onPress={() => {
          navigation.navigate("Edit", { item });
        }}
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
      >
        <View style={styles.listitem}>
          <Text style={styles.itemtext}>{item.name}</Text>

          <Text style={[styles.itemtext]}>
            ₹ {item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Text>

          <Text style={styles.itemtext}>{item.category}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  // Render function to render header from the data
  const renderSectionHeader = ({ section }) => {
    const totalExpense = calculateTotalExpenseOfMonth(section);
    const total =
      "₹" + totalExpense.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{section.month}</Text>
        <Text style={[styles.sectionHeaderText]}>Total: {total}</Text>
      </View>
    );
  };

  const itemSeparator = () => {
    return <View style={styles.itemSeparator}></View>;
  };

  const SectionSeparator = () => {
    return <View style={styles.SectionSeparator}></View>;
  };

  return (
    <View style={styles.container}>

      {isLoading ? <LoadingText /> : (
      <View style={styles.sectionview}>
        <SectionList
            sections={expenses}
            keyExtractor={(item, index) => item.date + "-" + index}
            renderItem={renderitem}
            renderSectionHeader={renderSectionHeader}
            ItemSeparatorComponent={itemSeparator}
            SectionSeparatorComponent={SectionSeparator}
          />
      </View> )}

      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          navigation.navigate("AddExpense");
        }}
        activeOpacity={0.5}
        underlayColor="#65E765"
      >
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableHighlight>

    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listitem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 30,
    paddingVertical: 3,
  },

  itemtext: {
    flex: 1,
    fontSize: 20,
  },

  itemSeparator: {
    height: 1.5,
    width: Dimensions.get("window").width - 20,
    backgroundColor: "darkgreen",
    alignSelf: "center",
  },

  SectionSeparator: {
    height: 1,
    width: Dimensions.get("window").width,
    backgroundColor: "darkgreen",
    alignSelf: "center",
  },

  sectionHeader: {
    backgroundColor: "lightgrey",
    paddingLeft: 7,
    paddingRight: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },

  sectionHeaderText: {
    fontSize: 14,
  },

  sectionview: {
    flex: 1,
  },

  // Styles for button
  button: {
    backgroundColor: "lightgreen",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default HomeScreen;

