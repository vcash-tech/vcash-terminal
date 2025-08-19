import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { LanguageService } from '@/services/languageService'

import { useNavigationContext } from './useNavigationHook'

interface UseLocaleReturn {
  currentLanguage: string
  changeLanguage: (language: string) => Promise<void>
  isLoading: boolean
}

/**
 * Custom hook for managing locale/language state with Serbian as default
 * - Loads Serbian by default on welcome page visits
 * - Persists language selection in localStorage throughout session
 * - Maintains language consistency during navigation unless changed via header
 */
export function useLocale(): UseLocaleReturn {
  const { i18n } = useTranslation()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language)
  const { startUrl } = useNavigationContext()

  // Check if user is on welcome page/template
  const isWelcomePage = location.pathname === '/' || location.pathname === startUrl // '/welcome'

  /**
   * Change language and persist to localStorage
   */
  const changeLanguage = useCallback(async (language: string) => {
    setIsLoading(true)
    try {
      await i18n.changeLanguage(language)
      LanguageService.setLanguagePreference(language)
      setCurrentLanguage(language)
    } catch (error) {
      console.error('Error changing language:', error)
    } finally {
      setIsLoading(false)
    }
  }, [i18n])

  /**
   * Initialize language based on page and localStorage
   */
  useEffect(() => {
    const initializeLanguage = async () => {
      const storedLanguage = LanguageService.getLanguagePreference()
      
      // If on welcome page and no stored preference, default to Serbian
      if (isWelcomePage && !localStorage.getItem(LanguageService.STORAGE_KEY)) {
        if (currentLanguage !== LanguageService.DEFAULT_LANGUAGE) {
          await changeLanguage(LanguageService.DEFAULT_LANGUAGE)
        }
      } 
      // If there's a stored preference different from current, apply it
      else if (storedLanguage && storedLanguage !== currentLanguage) {
        await changeLanguage(storedLanguage)
      }
    }

    initializeLanguage()
  }, [isWelcomePage, currentLanguage, changeLanguage])

  /**
   * Listen for i18n language changes to keep state in sync
   */
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng)
    }

    i18n.on('languageChanged', handleLanguageChange)
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  return {
    currentLanguage,
    changeLanguage,
    isLoading
  }
}