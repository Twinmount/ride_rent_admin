import useIsSmallScreen from '@/hooks/useIsSmallScreen'
import { AdminContextType, orgType, stateType } from '@/types/types'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'

const AdminContext = createContext<AdminContextType | null>(null)

const useAdminContext = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdminContext must be used within an AppProvider')
  }
  return context
}

type AdminProviderProps = {
  children: ReactNode
}

const AdminProvider = ({ children }: AdminProviderProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [org, setOrg] = useState<orgType>({ label: 'UAE', value: 'uae' })
  const [state, setState] = useState<stateType>({
    stateId: '',
    stateName: '',
    stateValue: '',
  })

  const isSmallScreen = useIsSmallScreen(1100)

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(false)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <AdminContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        isSmallScreen,
        org,
        setOrg,
        state,
        setState,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export { useAdminContext, AdminProvider }
