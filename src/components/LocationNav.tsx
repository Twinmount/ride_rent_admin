import { NavLink } from 'react-router-dom'

type NavItem = {
  label: string
  to: string
}

type LocationNavProps = {
  navItems: NavItem[]
}

export default function LocationNav({ navItems }: LocationNavProps) {
  return (
    <div className="w-full h-10 mx-auto my-4 overflow-hidden bg-white shadow gap-x-2 rounded-3xl flex-between max-w-64">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `w-full h-full flex-center rounded-3xl text-lg font-semibold ${
              isActive ? 'bg-yellow text-white' : 'text-yellow'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}
