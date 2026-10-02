import React from "react";
import { View, StyleSheet } from "react-native";

export const HomeIndicator = ({ isDark = false }: { isDark?: boolean }) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.pill,
          { backgroundColor: isDark ? "#FFFFFF" : "#0F172A" },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 24,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 8,
    width: "100%",
  },
  pill: {
    width: 134,
    height: 4,
    borderRadius: 2,
    opacity: 0.9,
  },
});

