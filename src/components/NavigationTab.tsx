import { NavLink } from "react-router-dom";

type NavItem = {
  label: string;
  to: string;
};

type NavigationTabProps = {
  navItems: NavItem[];
};

export default function NavigationTab({ navItems }: NavigationTabProps) {
  const isLinks = navItems.length > 2;

  const customClass = isLinks ? "max-w-fit " : "max-w-64";

  return (
    <div
      className={`flex overflow-hidden gap-x-2 justify-around mx-auto my-4 w-full h-10 bg-white rounded-3xl shadow ${customClass}`}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `w-full h-full flex flex-col justify-center items-center  gap-y-0 m-0 rounded-3xl ${
              isLinks ? "text-base px-3" : "text-lg"
            }  font-semibold ${
              isActive ? "bg-yellow text-white" : "text-yellow"
            }`
          }
        >
          <div className="m-0">{item.label}</div>
          {navItems.length > 2 && <p className="text-xs">Links</p>}
        </NavLink>
      ))}
    </div>
  );
}
