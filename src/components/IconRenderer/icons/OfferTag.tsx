const OfferTag = ({
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
        d="M7 7H7.01M7 17L17 7L21 11L11 21L7 17ZM7 17L3 13V7H9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default OfferTag;
