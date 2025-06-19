import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { LanguageService } from '@/services/languageService'

import en from './locales/en.json'
import rs from './locales/rs.json'

const resources = {
  en: {
    translation: en
  },
  rs: {
    translation: rs
  }
}

// Get the stored language preference
const storedLanguage = LanguageService.getLanguagePreference()

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: storedLanguage, // Use stored language preference
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    detection: {
      order: ['localStorage', 'navigator']
    }
  })

// Listen for language changes and save the preference
i18n.on('languageChanged', (lng) => {
  LanguageService.setLanguagePreference(lng)
})

export default i18n
