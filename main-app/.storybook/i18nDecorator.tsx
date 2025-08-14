import { Decorator } from '@storybook/react'
import React, { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'

import i18n from '../src/i18n/i18n'

export const WithI18n: Decorator = (Story, context) => {
    const { locale } = context.globals

    // Change language when the global locale changes
    useEffect(() => {
        if (locale) {
            i18n.changeLanguage(locale)
        }
    }, [locale])

    return (
        <I18nextProvider i18n={i18n}>
            <Story />
        </I18nextProvider>
    )
}
