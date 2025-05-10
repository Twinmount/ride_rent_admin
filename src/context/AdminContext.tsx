import useIsSmallScreen from "@/hooks/useIsSmallScreen";
import { AdminContextType, countryType, stateType } from "@/types/types";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

const AdminContext = createContext<AdminContextType | null>(null);

const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AppProvider");
  }
  return context;
};

type AdminProviderProps = {
  children: ReactNode;
};

const AdminProvider = ({ children }: AdminProviderProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [country, setCountry] = useState<countryType>({
    countryId: "",
    countryName: "",
    countryValue: "",
  });
  const [parentState, setParentState] = useState<stateType>({
    stateId: "",
    stateName: "",
    stateValue: "",
  });
  const [state, setState] = useState<stateType>({
    stateId: "",
    stateName: "",
    stateValue: "",
  });

  const isSmallScreen = useIsSmallScreen(1100);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        isSmallScreen,
        state,
        setState,
        country,
        setCountry,
        parentState,
        setParentState,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export { useAdminContext, AdminProvider };
