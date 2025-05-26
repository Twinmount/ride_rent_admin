type CountryKey = keyof typeof countries;

import { useAdminContext } from "@/context/AdminContext";
import { useState } from "react";

const countries = {
  UAE: {
    name: "UAE",
    value: "ae",
    imagePath: "/assets/icons/country-flags/uae-flag.png",
    registerUrl: "/ae/register",
    loginUrl: "/ae/login",
  },
  India: {
    name: "India",
    value: "in",
    imagePath: "/assets/icons/country-flags/india-flag.png",
    registerUrl: "/in/register",
    loginUrl: "/in/login",
  },
};

const RegisterCountryDropdown = ({
  country,
  type = "register",
}: {
  country: string;
  type?: string;
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryKey>(
    country === "ae" ? "UAE" : "India",
  );
  const [open, setOpen] = useState(false);
  const { updateAppCountry } = useAdminContext();

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm hover:bg-gray-50"
      >
        <img
          src={countries[selectedCountry].imagePath}
          alt={selectedCountry}
          className="mr-2 h-4 w-5"
        />
        <span className="text-sm">{countries[selectedCountry].name}</span>
        <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.2l3.71-3.97a.75.75 0 111.1 1.02l-4.25 4.54a.75.75 0 01-1.1 0L5.21 8.29a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-32 rounded-md border border-gray-200 bg-white shadow-lg">
          {Object.entries(countries).map(([key, country]) => (
            <a
              href={
                type === "register" ? country.registerUrl : country.loginUrl
              }
              key={key}
              onClick={() => {
                updateAppCountry(country.value);
                setSelectedCountry(key as CountryKey);
                setOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100"
            >
              <img
                src={country.imagePath}
                alt={`${country.name} flag`}
                className="mr-2 h-4 w-5"
              />
              {country.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegisterCountryDropdown;
