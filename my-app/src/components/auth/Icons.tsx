import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

// High-fidelity SVG Data URIs for crisp cross-platform rendering
export const GoogleIcon = ({ size = 20 }: { size?: number }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="%23EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="%234285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="%23FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="%2334A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
  return (
    <Image
      source={{ uri: `data:image/svg+xml;utf8,${svg}` }}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
};

export const EyeIcon = ({ size = 20, color = "#94A3B8" }: { size?: number; color?: string }) => {
  const encColor = encodeURIComponent(color);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${encColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
  return (
    <Image
      source={{ uri: `data:image/svg+xml;utf8,${svg}` }}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
};

export const EyeOffIcon = ({ size = 20, color = "#94A3B8" }: { size?: number; color?: string }) => {
  const encColor = encodeURIComponent(color);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${encColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
  return (
    <Image
      source={{ uri: `data:image/svg+xml;utf8,${svg}` }}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
};

export const ChevronLeftIcon = ({ size = 22, color = "#0F172A" }: { size?: number; color?: string }) => {
  const encColor = encodeURIComponent(color);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${encColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
  return (
    <Image
      source={{ uri: `data:image/svg+xml;utf8,${svg}` }}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
};

export const PaperPlaneIcon = ({ size = 36, color = "#3B82F6" }: { size?: number; color?: string }) => {
  const encColor = encodeURIComponent(color);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${encColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`;
  return (
    <Image
      source={{ uri: `data:image/svg+xml;utf8,${svg}` }}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
};

export const CheckmarkIcon = ({ size = 36, color = "#3B82F6" }: { size?: number; color?: string }) => {
  const encColor = encodeURIComponent(color);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${encColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`;
  return (
    <Image
      source={{ uri: `data:image/svg+xml;utf8,${svg}` }}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
};

export const StatusBarMock = ({ isDark = false }: { isDark?: boolean }) => {
  const fgColor = isDark ? "#FFFFFF" : "#0F172A";

  return (
    <View style={styles.statusBar}>
      <Text
        style={[
          styles.statusTime,
          { color: fgColor },
        ]}
      >
        9:41
      </Text>

      <View style={styles.statusIconsRight}>
        {/* Cellular Signal (4 bars) */}
        <View style={styles.cellularContainer}>
          <View style={[styles.cellularBar, { height: 4, backgroundColor: fgColor }]} />
          <View style={[styles.cellularBar, { height: 7, backgroundColor: fgColor }]} />
          <View style={[styles.cellularBar, { height: 10, backgroundColor: fgColor }]} />
          <View style={[styles.cellularBar, { height: 13, backgroundColor: fgColor }]} />
        </View>

        {/* Wifi Icon */}
        <View style={{ marginHorizontal: 6 }}>
          <Image
            source={{
              uri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 24 24" fill="none" stroke="${isDark ? "%23FFFFFF" : "%230F172A"}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
            }}
            style={{ width: 15, height: 12 }}
            resizeMode="contain"
          />
        </View>

        {/* Battery Icon */}
        <View style={styles.batteryContainer}>
          <View style={[styles.batteryBody, { borderColor: fgColor }]}>
            <View style={[styles.batteryFill, { backgroundColor: fgColor }]} />
          </View>
          <View style={[styles.batteryCap, { backgroundColor: fgColor }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    height: 44,
    paddingHorizontal: 24,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    zIndex: 10,
  },
  statusTime: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  statusIconsRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  cellularContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 14,
    gap: 1.5,
  },
  cellularBar: {
    width: 3,
    borderRadius: 0.75,
  },
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  batteryBody: {
    width: 22,
    height: 11,
    borderRadius: 3,
    borderWidth: 1.2,
    padding: 1.5,
    justifyContent: "center",
  },
  batteryFill: {
    width: "100%",
    height: "100%",
    borderRadius: 1,
  },
  batteryCap: {
    width: 1.5,
    height: 4,
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
    marginLeft: 1,
  },
});
