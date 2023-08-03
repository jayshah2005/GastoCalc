import DonutGraph from "../components/donutGraph";
import { View, StyleSheet, Text } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getExpensesOfMonth } from "../function/expensesTable";

const currentDate = new Date() 
const moneysign = '₹';


const Overview = () => {
    const [TotalExpenseOfMonth, setTotalExpenseOfMonth] = useState(0);
    const [prevTotalExpenseOfMonth, setprevTotalExpenseOfMonth] = useState(0);

    useFocusEffect(useCallback(() => {

        const fetchData = async () => {
            try {
                const currentMonthData = await getExpensesOfMonth(currentDate.getMonth() + 1);
      
                // Calculate the total expense for the current month using reduce
                const totalExpense = currentMonthData.reduce((total, expense) => total + expense.amount, 0);
                setTotalExpenseOfMonth(totalExpense);
      
                // Fetch the expenses for the previous month (assuming the previous month is the current month minus one)
                const previousMonthData = await getExpensesOfMonth(currentDate.getMonth());
      
                // Calculate the total expense for the previous month using reduce
                const prevTotalExpense = previousMonthData.reduce((total, expense) => total + expense.amount, 0);
                setprevTotalExpenseOfMonth(prevTotalExpense);
            } catch (error) {
                console.log("Error fetching data in DonutGraph: ", error);
            }
        }
        fetchData()

    }, []
    ))


    return(
        <View style={styles.container}>

            
            <DonutGraph />
            { prevTotalExpenseOfMonth > TotalExpenseOfMonth ? (
                <Text style={{color: '#65E765'}}>Yay! You spent {moneysign}{(prevTotalExpenseOfMonth - TotalExpenseOfMonth).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} less than last month.</Text>
                ) : (
                    <Text style={{color:'#FF1A1A'}}>You spent {moneysign}{(TotalExpenseOfMonth - prevTotalExpenseOfMonth).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} more than last month.</Text>
                )}
        </View>
    )
}

export default Overview

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
})