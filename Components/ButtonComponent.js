import React from "react";
import { Text, StyleSheet } from "react-native";
import Ripple from "react-native-material-ripple";

//Custom imports
import colors from "../Constants/colors";

function ButtonComponent(props) {
  return (
    <Ripple
      style={[styles.button, props.style]}
      onPress={props.doSomething}
      rippleContainerBorderRadius={30}
    >
      <Text style={styles.title}>{props.title}</Text>
    </Ripple>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    elevation: 3,
    backgroundColor: colors.secondaryColor,
  },
  title: {
    textAlign: "center",
    justifyContent: "center",
    fontFamily: "open-sans-bold",
    textAlignVertical: "center",
    fontSize: 20,
    color: "white",
  },
});

export default ButtonComponent;
