const Sedan = ({
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
        d="M3 15H21M5 15V13C5 11.8954 5.89543 11 7 11H8L9 8H15L16 11H17C18.1046 11 19 11.8954 19 13V15M7 19C7 19.5523 6.55228 20 6 20C5.44772 20 5 19.5523 5 19C5 18.4477 5.44772 18 6 18C6.55228 18 7 18.4477 7 19ZM19 19C19 19.5523 18.5523 20 18 20C17.4477 20 17 19.5523 17 19C17 18.4477 17.4477 18 18 18C18.5523 18 19 18.4477 19 19Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Sedan;
