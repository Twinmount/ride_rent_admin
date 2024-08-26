import { NavLink } from 'react-router-dom'

export default function CompanyRegistrationsNav() {
  return (
    <div className="w-full mx-auto my-4 max-w-72">
      <div className="w-full h-10 overflow-x-auto bg-white shadow max-h-14 gap-x-2 rounded-3xl flex-between">
        <NavLink
          to="/registrations"
          end
          className={({ isActive }) =>
            `w-full h-full flex flex-col items-center   rounded-3xl font-semibold ${
              isActive ? 'bg-yellow text-white' : 'text-yellow'
            }`
          }
        >
          All
          <span className="relative text-xs bottom-2 h-fit">registrations</span>
        </NavLink>
        <NavLink
          to="/registrations/new"
          className={({ isActive }) =>
            `w-full h-full flex flex-col items-center   rounded-3xl font-semibold ${
              isActive ? 'bg-yellow text-white' : 'text-yellow'
            }`
          }
        >
          New
          <span className="relative text-xs bottom-2 h-fit">registrations</span>
        </NavLink>
        {/* <NavLink
          to="/registrations/updated"
          className={({ isActive }) =>
            `w-full h-full flex flex-col items-center   rounded-3xl font-semibold ${
              isActive ? 'bg-yellow text-white' : 'text-yellow'
            }`
          }
        >
          Updated
          <span className="relative text-xs bottom-2 h-fit">registrations</span>
        </NavLink> */}
        <NavLink
          to="/registrations/rejected"
          className={({ isActive }) =>
            `w-full h-full flex flex-col items-center   rounded-3xl font-semibold ${
              isActive ? 'bg-yellow text-white' : 'text-yellow'
            }`
          }
        >
          Rejected
          <span className="relative text-xs bottom-2 h-fit">registrations</span>
        </NavLink>
      </div>
    </div>
  )
}
