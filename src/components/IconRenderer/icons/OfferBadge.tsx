const OfferBadge = ({
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
        d="M12 15L14.3511 16.483L13.6826 13.8042L15.8237 12L13.0886 11.8042L12 9.25L10.9114 11.8042L8.17633 12L10.3174 13.8042L9.6489 16.483L12 15Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.0711 20.4853L12 17.6568L4.92893 20.4853L6.34315 13L2.00002 8L9.00002 7L12 0L15 7L22 8L17.6569 13L19.0711 20.4853Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default OfferBadge;
