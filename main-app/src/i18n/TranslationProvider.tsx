import { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'

import i18n from './i18n'

interface TranslationProviderProps {
  children: ReactNode
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
