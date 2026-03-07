const HappyFace = ({
  height = 40,
  width = 40,
  color = "#FFC107", // Default yellow for emoji
  strokeWidth = "1.5",
}: {
  height?: number;
  width?: number;
  color?: string;
  strokeWidth?: string;
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
      <path
        d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9H9.01"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 9H15.01"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default HappyFace;
