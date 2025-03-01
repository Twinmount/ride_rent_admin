import Navbar from "@/components/general/Navbar";
import MainWrapper from "@/components/general/MainWrapper";
import { Outlet } from "react-router-dom";
import StatesLoadingSkelton from "@/components/skelton/StatesLoader";
import ScrollToTop from "@/helpers/ScrollToTop";
import { MantineProvider } from "@mantine/core";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useFetchGlobalStates } from "@/hooks/useFetchGlobalStates";

export default function Layout() {
  const { options, isLoading, isError, error } = useFetchGlobalStates();

  if (isError) {
    return (
      <div className="flex h-screen w-full justify-center bg-white pt-64 text-3xl text-red-500">
        Error fetching states :\ <br />
        {error?.message}
      </div>
    );
  }

  return (
    <MantineProvider>
      <Navbar options={options} isLoading={isLoading} />

      <Sidebar />

      <ScrollToTop />
      <MainWrapper>
        {isLoading ? (
          <div>
            <StatesLoadingSkelton />
          </div>
        ) : (
          <Outlet />
        )}
      </MainWrapper>
    </MantineProvider>
  );
}
