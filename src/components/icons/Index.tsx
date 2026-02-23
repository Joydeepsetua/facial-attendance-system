import React from "react";
import { ICON_MAP, AppIconName } from "./icons";
import { ICON_SIZES } from "../../constants/sizes";
import colors from "../../constants/colors";

interface IconProps {
  name: AppIconName;
  size?: keyof typeof ICON_SIZES;
  color?: string;
  strokeWidth?: number;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = "md",
  color = colors.BLACK,
  strokeWidth = 2,
}) => {
  const LucideIcon = ICON_MAP[name];

  if (!LucideIcon) return null;

  return (
    <LucideIcon
      size={ICON_SIZES[size]}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
};

export default React.memo(Icon);