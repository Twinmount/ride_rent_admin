import useIsSmallScreen from "@/hooks/useIsSmallScreen";
import React, { Suspense } from "react";
import LazyLoader from "../skelton/LazyLoader";

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSmallScreen = useIsSmallScreen(1100);

  return (
    <main
      style={{
        marginTop: "4.84rem",
        padding: "0.1rem",
        paddingLeft: isSmallScreen ? "0rem" : "14rem",
      }}
      className="wrapper h-full w-full bg-gray_bg"
    >
      <Suspense fallback={<LazyLoader />}>
        <div className="mx-auto">{children}</div>
      </Suspense>
    </main>
  );
}
