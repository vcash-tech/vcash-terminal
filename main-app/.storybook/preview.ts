import '../src/styles/app.scss'
import '../src/styles/storybook.scss'
import '../src/i18n/i18n' // Import i18n configuration

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Preview } from '@storybook/react'

import { withKeyboardProvider } from '../src/stories/decorators/withKeyboardProvider'
import { withNavigationProvider } from '../src/stories/decorators/withNavigationProvider'
import { WithI18n } from './i18nDecorator'

// Custom viewport for 1080x1920 size
const customViewports = {
    terminal1080x1920: {
        name: 'Terminal (1080x1920)',
        styles: {
            width: '1080px',
            height: '1920px'
        }
    }
}

const preview: Preview = {
    decorators: [WithI18n, withKeyboardProvider, withNavigationProvider],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        },
        viewport: {
            viewports: {
                ...INITIAL_VIEWPORTS,
                ...customViewports
            },
            defaultViewport: 'terminal1080x1920'
        }
    },
    globalTypes: {
        locale: {
            name: 'Language',
            description: 'Internationalization locale',
            defaultValue: 'rs',
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