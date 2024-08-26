import { Link } from 'react-router-dom'
import { useAdminContext } from '@/context/AdminContext'
import { Menu } from 'lucide-react'

import StatesDropdown from '../StatesDropdown'
import { stateType } from '@/types/types'

type NavbarProps = {
  options: stateType[]
  isLoading: boolean
}
const Navbar = ({ options, isLoading }: NavbarProps) => {
  const { isSidebarOpen, toggleSidebar, isSmallScreen } = useAdminContext()

  return (
    <header className="px-4 fixed top-0 left-0 right-0 h-[4.84rem] border-b bg-white z-50 transition-all ease-in-out flex-center">
      <nav className="flex items-center justify-between w-full">
        <div className="w-fit flex-center gap-x-4 ">
          {isSmallScreen && (
            <button
              aria-label="Hamburger"
              className="p-0 m-0 bg-transparent border-none outline-none cursor-pointer flex-center group"
              onClick={toggleSidebar}
            >
              <Menu
                strokeWidth={3}
                className={`w-[1.6rem] h-[1.6rem] transition-colors duration-100 ease-in mb-1  group-hover:text-yellow`}
              />
            </button>
          )}
          <div className="p-0 w-fit">
            <Link
              to={'/'}
              className="p-0 text-sm text-right text-gray-600 max-w-fit"
            >
              <figure className="m-0 max-sm:hidden">
                <img
                  src={'/assets/logo/header/header_logo.webp'}
                  className="w-32"
                  alt="Ride Rent Logo"
                />
                <figcaption className="text-[0.6rem]">
                  Quick way to get a{' '}
                  <span className="italic font-bold text-black">
                    Ride On Rent
                  </span>
                </figcaption>
              </figure>
            </Link>
          </div>
        </div>

        {/* sidebar */}
        {isSidebarOpen && isSmallScreen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/30 z-[100] "
            onClick={toggleSidebar}
          />
        )}

        <div className="mr-6 flex-center gap-x-4">
          <StatesDropdown options={options} isLoading={isLoading} />
        </div>
      </nav>
    </header>
  )
}
export default Navbar
