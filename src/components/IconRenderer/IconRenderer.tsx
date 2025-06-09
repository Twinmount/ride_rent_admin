import { icons, IconName } from "./icons";

export function IconRenderer({
  name,
  height = 40,
  width = 40,
  color = "#000",
  strokeWidth = "1.5",
}: {
  name: IconName;
  height?: number;
  width?: number;
  color?: string;
  strokeWidth?: string;
}) {
  const IconComponent = icons[name];

  if (!IconComponent) return null;

  return (
    <IconComponent
      height={height}
      width={width}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
}
