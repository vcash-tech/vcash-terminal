import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * A custom hook that provides translation functionality and language switching
 * @returns Translation utilities and current language information
 */
export const useTranslate = () => {
  const { t, i18n } = useTranslation()
  
  /**
   * Change the current language
   * @param language - Language code ('en' or 'rs')
   */
  const changeLanguage = useCallback((language: string) => {
    i18n.changeLanguage(language)
  }, [i18n])
  
  /**
   * Get the current language
   * @returns The current language code
   */
  const getCurrentLanguage = useCallback(() => {
    return i18n.language
  }, [i18n])
  
  /**
   * Check if a specific language is currently active
   * @param language - Language code to check
   * @returns True if the specified language is active
   */
  const isLanguageActive = useCallback((language: string) => {
    return i18n.language === language
  }, [i18n])
  
  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage,
    isLanguageActive
  }
}
