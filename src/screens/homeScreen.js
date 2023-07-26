// HomeScreen.js
import React, { useCallback, useEffect, useState } from "react";
import { View, SectionList, Text, StyleSheet, Dimensions } from "react-native";
import { getExpenses } from "../function/expensesTable";
import { db } from "../function/openDatabase";
import { useFocusEffect } from "@react-navigation/native";


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

  useFocusEffect(
    useCallback(() => {

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
    }, [])
  )

  // Render function to render items from the data
  const renderitem = ({ item }) => {
    return (
      <View style={styles.listitem}>
        <Text style={styles.itemtext}>{item.name}</Text>
        <Text style={[styles.itemtext]}>
          ₹ {(item.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </Text>
        <Text style={styles.itemtext}>{item.category}</Text>
      </View>
    );
  };

  // Render function to render header from the data
  const renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{section.date}</Text>
      </View>
    );
  };

  const itemSeparator = () => {
    return(
      <View style={styles.itemSeparator}></View>
    )
  }

  const SectionSeparator = () => {
    return(
      <View style={styles.SectionSeparator}></View>
    )
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={expenses}
        keyExtractor={(item, index) => item.date + "-" + index}
        renderItem={renderitem}
        renderSectionHeader={renderSectionHeader}
        ItemSeparatorComponent={itemSeparator}
        SectionSeparatorComponent={SectionSeparator}
      />
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
  },

  itemtext: {
    flex: 1,
    fontSize: 20,
  },

  itemSeparator: {
    height: 1.5,
    width: Dimensions.get('window').width - 20,
    backgroundColor: 'darkgreen',
    alignSelf: 'center'
  },

  SectionSeparator: {
    height: 1,
    width: Dimensions.get('window').width,
    backgroundColor: 'darkgreen',
    alignSelf: 'center'
  },

  sectionHeader: {
    backgroundColor: 'lightgrey',
    paddingLeft: 7
  }, 

  sectionHeaderText: {
    fontSize: 14,
  }
});

export default HomeScreen;
