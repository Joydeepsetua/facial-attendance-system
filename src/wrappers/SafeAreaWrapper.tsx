import React from "react";
import {
  View,
  StatusBar,
  StyleSheet,
  ViewStyle,
  StatusBarStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../constants/colors";

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  barStyle?: StatusBarStyle;
  edges?: ("top" | "bottom" | "left" | "right")[];
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  style,
  backgroundColor,
  barStyle,
  edges = ["top", "bottom"],
}) => {
  // Always use dark theme regardless of system settings
  const finalBackground = backgroundColor || colors.BG_DARK;
  const finalBarStyle: StatusBarStyle = barStyle || "light-content";

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: finalBackground }]}
      edges={edges}
    >
      <StatusBar
        backgroundColor={finalBackground}
        barStyle={finalBarStyle}
      />
      <View style={[styles.container, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default React.memo(SafeAreaWrapper);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.BG_DARK,
  },
});