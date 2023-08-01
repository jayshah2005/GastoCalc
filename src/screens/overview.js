import DonutGraph from "../components/donutGraph";
import { View, StyleSheet, Text } from "react-native";


const Overview = () => {

    return(
        <View style={styles.container}>
            <DonutGraph />
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