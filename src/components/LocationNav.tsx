import { NavLink } from 'react-router-dom'

export default function LocationNav() {
  return (
    <div className="w-full h-10 mx-auto my-4 overflow-hidden bg-white shadow gap-x-2 rounded-3xl flex-between max-w-64">
      <NavLink
        to="/locations/manage-states"
        className={({ isActive }) =>
          `w-full h-full flex-center rounded-3xl text-lg font-semibold ${
            isActive ? 'bg-yellow text-white' : 'text-yellow'
          }`
        }
      >
        States
      </NavLink>
      <NavLink
        to="/locations/manage-cities"
        className={({ isActive }) =>
          `w-full h-full flex-center rounded-3xl text-lg font-semibold ${
            isActive ? 'bg-yellow text-white' : 'text-yellow'
          }`
        }
      >
        Cities
      </NavLink>
    </div>
  )
}
