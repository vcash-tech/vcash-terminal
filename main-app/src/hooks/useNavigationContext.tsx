import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { 
  DEFAULT_ALLOWED_START_PATHS,
  NavigationContext,
  NavigationContextType, 
  NavigationProviderProps, 
  SESSION_ID,
  STORAGE_KEY,
} from './navigationConstants'

export function NavigationProvider({ 
  children, 
  allowedStartPaths = DEFAULT_ALLOWED_START_PATHS 
}: NavigationProviderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [startUrl, setStartUrl] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY) ?? '/welcome'
  })
  
  const [_sessionId, setSessionId] = useState<string | null>(() => {
    // fetch sessionId from localStorage or generate a new one
    return localStorage.getItem(SESSION_ID) ?? crypto.randomUUID()
  })

  const setStartIfEligible = useCallback(() => {
    const currentPath = location.pathname
    if (allowedStartPaths.includes(currentPath) && !startUrl) {
      const newStartUrl = currentPath
      localStorage.setItem(STORAGE_KEY, newStartUrl)
      setStartUrl(newStartUrl ?? '/welcome')
      
      const newSessionId = crypto.randomUUID()
      localStorage.setItem(SESSION_ID, newSessionId)
      setSessionId(newSessionId)
    }
  }, [location.pathname, allowedStartPaths, startUrl])

  const clearStart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setStartUrl('/welcome')

    localStorage.removeItem(SESSION_ID)
    setSessionId(crypto.randomUUID())
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

  useEffect(() => {
    const currentPath = location.pathname
    if (allowedStartPaths.includes(currentPath)) {
      localStorage.setItem(STORAGE_KEY, currentPath)
      setStartUrl(currentPath)
      const newSessionId = crypto.randomUUID()
      localStorage.setItem(SESSION_ID, newSessionId)
      setSessionId(newSessionId)
    }
  }, [location.pathname, allowedStartPaths, startUrl])

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}
