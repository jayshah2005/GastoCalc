import React, { useState, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";
import { getExpensesOfMonth } from "../function/expensesTable";
import { useCategoriesContext } from "../contextAPI/globalVariables";

// Convert a string into a hex color code
const stringToHex = (str) => {
  let hexcode = [];
  let asciiValue = 0;

  for (let i = 0; i < str.length; i++) {
    asciiValue += str.charCodeAt(i);
  }

  let color = Math.floor(asciiValue * 10000000 + 1);

  hexcode = "#" + ("000000" + color.toString(16)).slice(-6);

  return hexcode;
};

const DonutGraph = () => {
  // Fetching categories
  const category = useCategoriesContext();

  // State Hooks
  const [categoryData, setCategoryData] = useState([]);
  const [totalexpense, setTotalexpense] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [startAngles, setStartAngles] = useState([]);

  // Constants for donut graph
  const size = 200;
  const strokeWidth = 25;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const moneysign = "₹";
  const date = new Date();
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

  // rawData used to make sure everything stays upto date
  const rawData = getExpensesOfMonth(date.getMonth() + 1);

  // Fetching data everytime screen comes in focus
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        // Creating an array of all categories
        try {
          const temp = category.map((category) => ({
            category: category,
            amount: 0,
            color: stringToHex(category),
          }));

          // Filling previous array(CategoryData) with data
          const rawData = await getExpensesOfMonth(date.getMonth() + 1);
          let sum = 0;
          rawData.forEach((expense) => {
            const index = temp.findIndex(
              (item) => item.category === expense.category
            );

            if (index !== -1) {
              temp[index].amount += expense.amount;
              sum += expense.amount;
            }
          });

          setCategoryData(temp);
          setTotalexpense(sum);

          // Setting up start and end angle for components of donut graph
          let angle = 0;
          const angles = [];
          categoryData.forEach((category) => {
            angles.push(angle);
            angle += (category.amount / totalexpense) * 360;
          });

          setStartAngles(angles);

          setIsLoading(false); // Data processing complete, set isLoading to false to load the graph
        } catch (error) {
          console.log("Error fetching data in overview.js: ", error);
        }
      };

      fetchData();
    }, [rawData])
  );

  // Rendering graph
  const visualdata = categoryData.map((category, index) => {
    const strokeDashoffset =
      circumference * (1 - category.amount / totalexpense);
    return (
      <Circle
        key={index}
        cx={center}
        cy={center}
        strokeWidth={strokeWidth}
        stroke={category.color}
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        originX={center}
        originY={center}
        rotation={startAngles[index]}
      />
    );
  });

  // Rendering text
  const textdata = categoryData.map((category, index) => {
    return (
      <View style={{ flexDirection: "row", padding: 5 }} key={index}>
        <View
          style={{ height: 20, width: 20, backgroundColor: category.color }}
        />
        <Text>
          {" "}
          {category.category} ({moneysign}
          {category.amount} |{" "}
          {Math.floor((category.amount * 100) / totalexpense)}%)
        </Text>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      {!isLoading ? (
        <>
          <View style={{ flex: 1 }}>
            <View>{textdata}</View>
          </View>
          <View style={{ flex: 1 }}>
            <Svg viewBox={`0 0 ${size} ${size}`} height={size} width={size}>
              {visualdata}
            </Svg>
            <Text style={styles.totalText}>
              Total: {moneysign}{" "}
              {totalexpense.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Text>
            <Text style={styles.graphtitle}>
              Expenses Based On Category(
              {month[date.getMonth()] + " " + date.getFullYear()})
            </Text>
          </View>
        </>
      ) : (
        // Show loading indicator or any other UI while waiting for data
        <Text style={{ flex: 1, textAlign: "center" }}>Loading...</Text>
      )}
    </View>
  );
};

export default DonutGraph;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  graphWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  graphtitle: {
    alignSelf: "center",
    paddingTop: 20,
    fontSize: 15,
    fontWeight: "bold",
  },
  totalText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#394867",
    textAlign: "center",
  },
});
