import DonutGraph from "../components/donutGraph";
import {
  View,
  StyleSheet,
  Text,
  SectionList,
  TouchableHighlight,
} from "react-native";
import { Dimensions } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getExpensesOfMonth } from "../function/expensesTable";
import { getRecurringExpense } from "../function/recurringExpenses";

const currentDate = new Date();
const moneysign = "₹";
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

const Overview = ({ navigation }) => {
  const [TotalExpenseOfMonth, setTotalExpenseOfMonth] = useState(0);
  const [prevTotalExpenseOfMonth, setprevTotalExpenseOfMonth] = useState(0);
  const [recurringExpense, setRecurringExpense] = useState([]);

  const rawData = getRecurringExpense();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const currentMonthData = await getExpensesOfMonth(
            currentDate.getMonth() + 1
          );

          // Calculate the total expense for the current month using reduce
          const totalExpense = currentMonthData.reduce(
            (total, expense) => total + expense.amount,
            0
          );
          setTotalExpenseOfMonth(totalExpense);

          // Fetch the expenses for the previous month (assuming the previous month is the current month minus one)
          const previousMonthData = await getExpensesOfMonth(
            currentDate.getMonth()
          );

          // Calculate the total expense for the previous month using reduce
          const prevTotalExpense = previousMonthData.reduce(
            (total, expense) => total + expense.amount,
            0
          );
          setprevTotalExpenseOfMonth(prevTotalExpense);

          // Getting recurring expenses and updating it
          const rawData = await getRecurringExpense();
          const temp = [];

          rawData.map((rexpense) => {
            let date = new Date(rexpense.recurrencedate);
            let day =
              date.getDate() +
              "th " +
              month[date.getMonth()] +
              " " +
              date.getFullYear();

            let index = temp.findIndex((item) => item.recurrencedate === day);
            if (index != -1) {
              temp[index].data.push(rexpense);
            } else {
              temp.push({ recurrencedate: day, data: [rexpense] });
            }
          });
          setRecurringExpense(temp);
        } catch (error) {
          console.log("Error fetching data in DonutGraph: ", error);
        }
      };
      fetchData();
    }, [rawData])
  );

  const ComparisionText = () => (
    <>
      {prevTotalExpenseOfMonth >= TotalExpenseOfMonth ? (
        prevTotalExpenseOfMonth == TotalExpenseOfMonth ? (
          <View>
            <Text>You spent exactly the same as last month</Text>
          </View>
        ) : (
          <Text style={{ color: "#65E765" }}>
            Yay! You spent {moneysign}
            {(prevTotalExpenseOfMonth - TotalExpenseOfMonth)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
            less than last month.
          </Text>
        )
      ) : (
        <Text style={{ color: "#FF1A1A" }}>
          You spent {moneysign}
          {(TotalExpenseOfMonth - prevTotalExpenseOfMonth)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          more than last month.
        </Text>
      )}
    </>
  );

  // All render functions for the sectionlist
  // Render function to render items from the data
  const renderitem = ({ item }) => {
    return (
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="none"
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        onPress={() => {
          navigation.navigate("Edit", { item });
        }}
      >
        <View style={styles.listitem}>
          <Text style={styles.itemtext}>{item.name}</Text>

          <Text style={[styles.itemtext]}>
            {moneysign}{" "}
            {item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Text>

          <Text style={styles.itemtext}>{item.category}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  // Render function to render header from the data
  const renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{section.recurrencedate}</Text>
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
      {TotalExpenseOfMonth === 0 ? (
        <View>
          <Text style={styles.graphabsence}>
            Currently you have no expenses for this month
          </Text>
        </View>
      ) : (
        <>
          <DonutGraph />
          <ComparisionText />
        </>
      )}

      <View style={{ flex: 1 }}>
        <Text style={styles.upcomingTitle}>Upcoming Recurring Expense... </Text>
        <View
          style={{
            height: 1,
            backgroundColor: "black",
            width: Dimensions.get("window").width,
          }}
        />
        <SectionList
          sections={recurringExpense}
          renderItem={renderitem}
          renderSectionHeader={renderSectionHeader}
          ItemSeparatorComponent={itemSeparator}
          SectionSeparatorComponent={SectionSeparator}
        />
      </View>
    </View>
  );
};

export default Overview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  graphabsence: {
    flex: 1,
    verticalAlign: "middle",
  },

  upcomingTitle: {
    fontWeight: "500",
  },

  // Styles for sectionlist
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
});
