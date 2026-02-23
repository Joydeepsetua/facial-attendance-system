import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import Icon from "./Index";
import { AppIconName } from "./icons";
import colors from "../../constants/colors";

interface IconButtonProps {
  icon: AppIconName;
  onPress: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  color?: string;
  style?: ViewStyle;
  strokeWidth?: number;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = "md",
  color = colors.BLACK,
  style,
  strokeWidth = 3,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Icon name={icon} size={size} color={color} strokeWidth={strokeWidth}  />
    </TouchableOpacity>
  );
};

export default React.memo(IconButton);

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});