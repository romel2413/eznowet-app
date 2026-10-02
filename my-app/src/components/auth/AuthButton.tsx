import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
} from "react-native";

interface AuthButtonProps {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "white" | "secondary";
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  style,
  textStyle,
}) => {
  const isWhite = variant === "white";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={loading}
      style={[
        styles.baseButton,
        isWhite ? styles.whiteButton : styles.primaryButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isWhite ? "#0F172A" : "#FFFFFF"} />
      ) : (
        <Text
          style={[
            styles.baseText,
            isWhite ? styles.whiteText : styles.primaryText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#182230",
    borderRadius: 12,
  },
  whiteButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    height: 50,
  },
  baseText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
    fontFamily: Platform.select({
      web: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      default: undefined,
    }),
  },
  primaryText: {
    color: "#FFFFFF",
  },
  whiteText: {
    color: "#0F172A",
  },
});
