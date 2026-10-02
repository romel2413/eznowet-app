import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { GoogleIcon } from "./Icons";

interface GoogleButtonProps {
  onPress?: () => void;
  title?: string;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({
  onPress,
  title = "Continue with Google",
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.button}
    >
      <View style={styles.iconContainer}>
        <GoogleIcon size={18} />
      </View>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    width: "100%",
  },
  iconContainer: {
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E293B",
    letterSpacing: -0.1,
  },
});

