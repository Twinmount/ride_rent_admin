const OfferPercent = ({
  height = 40,
  width = 40,
  color = "#000",
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
      <path
        d="M19 5L5 19"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="6.5" r="2.5" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="17.5" cy="17.5" r="2.5" stroke={color} strokeWidth={strokeWidth} />
    </svg>
  );
};

export default OfferPercent;
