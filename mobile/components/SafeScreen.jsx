import { View, Text, StyleSheet } from "react-native";
import COLORS from "../constants/colors";

import React from "react";

const SafeScreen = ({ children }) => {
  return <View style={[styles.container]}>{children}</View>;
};

export default SafeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
