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
        width: 80,
        height: 30,
      },
      buttonView: {
        padding: 5
      },
})