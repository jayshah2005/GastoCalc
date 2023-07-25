// HomeScreen.js
import React, { useEffect, useState } from "react";
import { View, SectionList, Text, StyleSheet } from "react-native";
import { getExpenses } from "../function/expensesTable";

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

const HomeScreen = () => {
  //Fetching data from expenses table in GastoCalc.db and optimizing it to make it more useable
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      let temp = [];
      let groupedExpenses = [];

      try {
        const Data = await getExpenses();

        temp = Data.map((data) => {
          const key = new Date(data.date);
          return {
            date:
              key.getDate() +
              "th " +
              month[key.getMonth()] +
              " " +
              key.getFullYear(),
            data: [data],
          };
        });

        temp.forEach((piece) => {
          let datePresent = false;
          let index;

          for (index = 0; index < groupedExpenses.length; index++) {
            if (groupedExpenses[index].date === piece.date) {
              datePresent = true;
              break;
            }
            datePresent = false;
          }

          if (datePresent) {
            groupedExpenses[index].data.push(piece.data[0]);
          } else {
            groupedExpenses.push(piece);
          }
        });

        setExpenses(groupedExpenses);
      } catch (error) {
        console.log("Error retrieving expenses and seprating it:", error);
      }
    };
    fetchdata();
  }, []);

  // Render function to render items from the data
  const render = ({ item }) => {
    return (
      <View style={styles.listitem}>
        <Text style={styles.itemtext}>{item.name}</Text>
        <Text style={[{ textAlign: "left" }, styles.itemtext]}>
          {item.amount}Rs
        </Text>
        <Text style={styles.itemtext}>{item.category}</Text>
      </View>
    );
  };

  // Render function to render header from the data
  const renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.container}>
        <Text>{section.date}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={expenses}
        keyExtractor={(item, index) => item.date + "-" + index}
        renderItem={render}
        renderSectionHeader={renderSectionHeader}
      />
    </View>
  );
};

styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listitem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 30,
    paddingRight: 30,
  },

  itemtext: {
    fontSize: 18,
  },
});

export default HomeScreen;
