import { View, Text, TextInput, StyleSheet } from "react-native";

const Input = (props) => {
  const { text, placeholder, inputMode, multiline, value, onChangeText } =
    props;

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputText}>{text}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        inputMode={inputMode}
        multiline={multiline}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default Input;

styles = StyleSheet.create({
  input: {
    height: 40,
    width: 240,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  inputText: {
    fontSize: 15,
    alignItems: "baseline",
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 15,
  },
});
