import { Meta } from '@storybook/react'

import { TranslationDemo } from '../../.storybook/TranslationDemo'
import { useTranslate } from './useTranslate'

const meta = {
    title: 'Documentation/Internationalization',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Documentation for using the internationalization (i18n) system in the application'
            }
        }
    }
} satisfies Meta

export default meta

export const Overview = () => {
    const { t, changeLanguage, getCurrentLanguage } = useTranslate()

    return (
        <div>
            <h1>Internationalization (i18n) System</h1>

            <TranslationDemo />

            <h2>Using Translations in Components</h2>
            <p>
                To use translations in your components, import the{' '}
                <code>useTranslate</code> hook:
            </p>
            <pre
                style={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '4px',
                    overflow: 'auto'
                }}>
                {`import { useTranslate } from '@/i18n/useTranslate'

function MyComponent() {
  const { t } = useTranslate()
  
  return <h1>{t('some.translation.key')}</h1>
}`}
            </pre>

            <h2>Switching Languages</h2>
            <p>
                To switch languages programmatically, use the{' '}
                <code>changeLanguage</code> function:
            </p>
            <pre
                style={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '4px',
                    overflow: 'auto'
                }}>
                {`import { useTranslate } from '@/i18n/useTranslate'

function LanguageSwitcher() {
  const { changeLanguage } = useTranslate()
  
  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('rs')}>Serbian</button>
    </div>
  )
}`}
            </pre>

            <h2>Current Language</h2>
            <p>
                Current language:{' '}
                <strong>
                    {getCurrentLanguage() === 'en' ? 'English' : 'Serbian'}
                </strong>
            </p>
            <div>
                <button
                    onClick={() => changeLanguage('en')}
                    style={{
                        padding: '8px 16px',
                        margin: '0 8px 8px 0',
                        backgroundColor:
                            getCurrentLanguage() === 'en'
                                ? '#4CAF50'
                                : '#f1f1f1',
                        color:
                            getCurrentLanguage() === 'en' ? 'white' : 'black',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                    Switch to English
                </button>
                <button
                    onClick={() => changeLanguage('rs')}
                    style={{
                        padding: '8px 16px',
                        margin: '0 8px 8px 0',
                        backgroundColor:
                            getCurrentLanguage() === 'rs'
                                ? '#4CAF50'
                                : '#f1f1f1',
                        color:
                            getCurrentLanguage() === 'rs' ? 'white' : 'black',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                    Switch to Serbian
                </button>
            </div>

            <h2>Translation Examples</h2>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginTop: '20px'
                }}>
                <thead>
                    <tr>
                        <th
                            style={{
                                border: '1px solid #ddd',
                                padding: '8px',
                                textAlign: 'left'
                            }}>
                            Key
                        </th>
                        <th
                            style={{
                                border: '1px solid #ddd',
                                padding: '8px',
                                textAlign: 'left'
                            }}>
                            Translation
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td
                            style={{
                                border: '1px solid #ddd',
                                padding: '8px'
                            }}>
                            <code>header.back</code>
                        </td>
                        <td
                            style={{
                                border: '1px solid #ddd',
                                padding: '8px'
                            }}>
                            {t('header.back')}
                        </td>
                    </tr>
                    <tr>
                        <td
                            style={{
                                border: '1px solid #ddd',
                                padding: '8px'
                            }}>
                            <code>common.next</code>
                        </td>
                        <td
                            style={{
                                border: '1px solid #ddd',
                                padding: '8px'
                            }}>
                            {t('common.next')}
                        </td>
                    </tr>
                    <tr>
                        <td
                            style={{
                                border: '1px solid #ddd',
                                padding: '8px'
                            }}>
                            <code>common.cancel</code>
                        </td>
                        <td
                            style={{
                                border: '1px solid #ddd',
                                padding: '8px'
                            }}>
                            {t('common.cancel')}
                        </td>
                    </tr>
                    <tr>
                        <td
                            style={{
                                border: '1px solid #ddd',
                                padding: '8px'
                            }}>
                            <code>insertCash.title</code>
                        </td>
                        <td
                            style={{
                                border: '1px solid #ddd',
                                padding: '8px'
                            }}>
                            {t('insertCash.title')}
                        </td>
                    </tr>
                    <tr>
                        <td
                            style={{
                                border: '1px solid #ddd',
                                padding: '8px'
                            }}>
                            <code>register.title</code>
                        </td>
                        <td
                            style={{
                                border: '1px solid #ddd',
                                padding: '8px'
                            }}>
                            {t('register.title')}
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2>Using Variables in Translations</h2>
            <p>You can use variables in your translations:</p>
            <pre
                style={{
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '4px',
                    overflow: 'auto'
                }}>
                {`// In translation file:
// "welcome": "Welcome, {{name}}!"

import { useTranslate } from '@/i18n/useTranslate'

function Welcome({ name }) {
  const { t } = useTranslate()
  
  return <p>{t('welcome', { name })}</p>
}`}
            </pre>

            <h2>Example with variables:</h2>
            <p>{t('register.approvalPending', { brandName: 'VCash' })}</p>
        </div>
    )
}
