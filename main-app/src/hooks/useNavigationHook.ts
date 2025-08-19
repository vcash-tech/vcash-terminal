import { useContext } from 'react'

import { NavigationContext, NavigationContextType } from './navigationConstants'

export function useNavigationContext(): NavigationContextType {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider')
  }
  return context
}