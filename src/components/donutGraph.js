import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";
import { getExpenses } from "../function/expensesTable";
import { getCategory } from "../function/categoriesFetcher";
import LoadingText from "./loadingText";

// Convert a string into a hex color code
const stringToHex = (str) => {
    let hexcode = [];
    let asciiValue = 0;

    for (let i = 0; i < str.length; i++) {
        asciiValue += str.charCodeAt(i);
    }

    let color = Math.floor((asciiValue * 10000000) + 1);

    hexcode = "#" + ("000000" + color.toString(16)).slice(-6);

    return hexcode;
};

const DonutGraph = () => {
    const [categoryData, setCategoryData] = useState([]);
    const [totalexpense, setTotalexpense] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [startAngles, setStartAngles] = useState([])

    const size = 200;
    const strokeWidth = 25;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const moneysign = '₹';

    const rawData = getExpenses()


    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const category = await getCategory();
                    const temp = category.map((category) => ({
                        category: category,
                        amount: 0,
                        color: stringToHex(category),
                    }));

                    const rawData = await getExpenses();
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

                    let angle = 0;
                    const angles = []
                    categoryData.forEach((category) => {
                        angles.push(angle);
                        angle += (category.amount / totalexpense) * 360 
                    })

                    setStartAngles(angles)
                    
                    setIsLoading(false); // Data processing complete, set isLoading to false
                } catch (error) {
                    console.log("Error fetching data in overview.js: ", error);
                }
            };

            fetchData();
        }, [rawData])
    );

    const visualdata = categoryData.map((category, index) => {
        const strokeDashoffset = circumference * (1 - category.amount / totalexpense);
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
    })

    const textdata = categoryData.map((category, index) => {
        return(
            <View style={{flexDirection: "row", padding: 5}} key={index} >
                 <View style={{height: 20, width: 20, backgroundColor:category.color }} />
                 <Text>  {category.category} ({moneysign}{category.amount} | {Math.floor(category.amount*100/totalexpense)}%)</Text>
            </View>
           
        )
    })

    return (
        <View style={styles.container}>
            <View style={{flex: 1}}>
                <View style={styles.categoryData}>
                    {textdata}
                </View>
            </View>
                {!isLoading ? (
                    // Show the donut graph
                    <View>
                        <Svg viewBox={`0 0 ${size} ${size}`} height={size} width={size}>
                            {visualdata}
                        </Svg>
                        <Text style={styles.graphtitle}>Expenses Based On Category </Text>
                    </View>
                ) : (
                    // Show loading indicator or any other UI while waiting for data
                    <Text style={{flex: 1, textAlign: 'center'}} >Loading...</Text>
                )}   
        </View>
    );
};

export default DonutGraph;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
    },
    graphWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    graphtitle: {
        alignSelf: 'center',
        paddingTop: 20,
        fontSize: 15,
        fontWeight: '700',
    },
    categoryData: {
        
    },
});
