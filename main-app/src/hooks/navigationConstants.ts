import { createContext, ReactNode } from 'react'

export interface NavigationContextType {
  startUrl: string | null
  isStartSet: boolean
  setStartIfEligible: () => void
  goBackToStart: (options?: { clearAfter?: boolean; replace?: boolean }) => void
  clearStart: () => void
}

export const STORAGE_KEY = 'navigation.startUrl'
export const DEFAULT_ALLOWED_START_PATHS = ['/welcome', '/welcome-with-services']

export interface NavigationProviderProps {
  children: ReactNode
  allowedStartPaths?: string[]
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined)
