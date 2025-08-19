import { createContext, ReactNode,useCallback, useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface NavigationContextType {
  startUrl: string | null
  isStartSet: boolean
  setStartIfEligible: () => void
  goBackToStart: (options?: { clearAfter?: boolean; replace?: boolean }) => void
  clearStart: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

const STORAGE_KEY = 'navigation.startUrl'
const DEFAULT_ALLOWED_START_PATHS = ['/welcome', '/welcome-with-services']

interface NavigationProviderProps {
  children: ReactNode
  allowedStartPaths?: string[]
}

export function NavigationProvider({ 
  children, 
  allowedStartPaths = DEFAULT_ALLOWED_START_PATHS 
}: NavigationProviderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [startUrl, setStartUrl] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY) ?? '/welcome'
  })

  const setStartIfEligible = useCallback(() => {
    const currentPath = location.pathname
    if (allowedStartPaths.includes(currentPath) && !startUrl) {
      const newStartUrl = currentPath
      localStorage.setItem(STORAGE_KEY, newStartUrl)
      setStartUrl(newStartUrl)
    }
  }, [location.pathname, allowedStartPaths, startUrl])

  const clearStart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setStartUrl('/welcome')
  }, [])

  const goBackToStart = useCallback((options: { clearAfter?: boolean; replace?: boolean } = {}) => {
    const { clearAfter = true, replace = true } = options
    
    if (startUrl) {
      navigate(startUrl, { replace })
      if (clearAfter) {
        clearStart()
      }
    }
  }, [startUrl, navigate, clearStart])

  const contextValue: NavigationContextType = {
    startUrl,
    isStartSet: Boolean(startUrl),
    setStartIfEligible,
    goBackToStart,
    clearStart
  }

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigationContext(): NavigationContextType {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider')
  }
  return context
}