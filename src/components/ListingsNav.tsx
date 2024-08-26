import { NavLink } from 'react-router-dom'

export default function ListingsNav() {
  return (
    <div className="w-full h-10 mx-auto my-4 overflow-hidden bg-white shadow gap-x-2 rounded-3xl flex-between max-w-[20rem]">
      <NavLink
        to="/listings/all"
        className={({ isActive }) =>
          `w-full h-full flex-center rounded-3xl  font-semibold ${
            isActive ? 'bg-yellow text-white' : 'text-yellow'
          }`
        }
      >
        All
      </NavLink>
      <NavLink
        to="/listings/new"
        className={({ isActive }) =>
          `w-full h-full flex-center rounded-3xl  font-semibold ${
            isActive ? 'bg-yellow text-white' : 'text-yellow'
          }`
        }
      >
        New
      </NavLink>
      <NavLink
        to="/listings/updated"
        className={({ isActive }) =>
          `w-full h-full flex-center rounded-3xl  font-semibold ${
            isActive ? 'bg-yellow text-white' : 'text-yellow'
          }`
        }
      >
        Updated
      </NavLink>
      <NavLink
        to="/listings/rejected"
        className={({ isActive }) =>
          `w-full h-full flex-center rounded-3xl  font-semibold ${
            isActive ? 'bg-yellow text-white' : 'text-yellow'
          }`
        }
      >
        Rejected
      </NavLink>
    </div>
  )
}
