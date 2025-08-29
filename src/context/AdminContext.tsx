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

const appSuportedCountries = [
  {
    id: "ee8a7c95-303d-4f55-bd6c-85063ff1cf48",
    name: "UAE",
    value: "ae",
    icon: "/assets/icons/country-flags/uae-flag.png",
  },
  {
    id: "68ea1314-08ed-4bba-a2b1-af549946523d",
    name: "India",
    value: "in",
    icon: "/assets/icons/country-flags/india-flag.png",
  },
];


const AdminProvider = ({ children }: AdminProviderProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [appCountry, setAppCountry] = useState<string>(() => {
    return localStorage.getItem('appCountry') || appSuportedCountries[0].value;
  });
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

  const updateAppCountry = (newCountry: string) => {
    setAppCountry(newCountry);
    localStorage.setItem('appCountry', newCountry);
  }

  const isSmallScreen = useIsSmallScreen(1100);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!localStorage.getItem("appCountry")) {
      localStorage.setItem("appCountry", appSuportedCountries[0].value);
    }
  }, [appCountry]);

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
        appCountry,
        updateAppCountry,
        appSuportedCountries
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export { useAdminContext, AdminProvider };
