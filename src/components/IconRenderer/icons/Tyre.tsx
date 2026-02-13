const Tyre = ({
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
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="4" stroke={color} strokeWidth={strokeWidth} />
      <path
        d="M12 3V5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M12 19V21"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M21 12H19"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M5 12H3"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M18.364 5.63605L16.9498 7.05026"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M7.05029 16.9497L5.63608 18.364"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M18.364 18.364L16.9498 16.9497"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M7.05029 7.05023L5.63608 5.63602"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Tyre;
