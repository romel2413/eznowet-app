import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { EyeIcon, EyeOffIcon } from "./Icons";

interface AuthInputProps extends TextInputProps {
  isPassword?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  isPassword = false,
  style,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, isPassword && styles.inputWithIcon, style]}
        placeholderTextColor="#94A3B8"
        secureTextEntry={isPassword && !showPassword}
        autoCapitalize="none"
        {...props}
      />
      {isPassword && (
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {showPassword ? (
            <EyeOffIcon size={18} color="#94A3B8" />
          ) : (
            <EyeIcon size={18} color="#94A3B8" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    marginBottom: 12,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
  },
  inputWithIcon: {
    paddingRight: 46,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    top: 15,
  },
});

