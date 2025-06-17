import '../src/styles/app.scss'
import '../src/styles/storybook.scss'
import '../src/i18n/i18n' // Import i18n configuration

import type { Preview } from '@storybook/react'

import { withKeyboardProvider } from '../src/stories/decorators/withKeyboardProvider'
import { WithI18n } from './i18nDecorator'

const preview: Preview = {
    decorators: [WithI18n, withKeyboardProvider],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        }
    },
    globalTypes: {
        locale: {
            name: 'Language',
            description: 'Internationalization locale',
            defaultValue: 'en',
            toolbar: {
                icon: 'globe',
                items: [
                    { value: 'en', title: 'English' },
                    { value: 'rs', title: 'Serbian' }
                ]
            }
        }
    },
    tags: ['autodocs']
}

export default preview