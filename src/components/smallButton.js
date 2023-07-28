import { View, Text, StyleSheet, TouchableHighlight } from "react-native";

const smallButton = (props) => {
    const { onPress, text, color, underlayColor } = props;

    return (
        <View style={styles.buttonView}>
            <TouchableHighlight style={[{ backgroundColor: color }, styles.addButton,]} onPress={onPress} activeOpacity={0.5} underlayColor={underlayColor} >
            <Text>{ text }</Text>
            </TouchableHighlight>
        </View>
    )
}

export default smallButton

const styles = StyleSheet.create({
    addButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 100, 
        height: 40, 
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: {
        width: 0,
        height: 2,
        },
    },
    buttonView: {
        padding: 5
    },
})