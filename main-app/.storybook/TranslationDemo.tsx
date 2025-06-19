import React from 'react'
import { useTranslation } from 'react-i18next'

/**
 * A component to demonstrate translations in Storybook
 * This can be used in stories to show how translations work
 */
export const TranslationDemo: React.FC = () => {
    const { t, i18n } = useTranslation()

    return (
        <div
            style={{
                padding: '10px',
                marginBottom: '20px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px'
            }}>
            <h3 style={{ margin: '0 0 10px 0' }}>
                Current Language:{' '}
                <strong>
                    {i18n.language === 'en' ? 'English' : 'Serbian'}
                </strong>
            </h3>
            <p style={{ margin: '5px 0' }}>
                Use the globe icon in the Storybook toolbar to switch languages
            </p>
            <div
                style={{
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#fff',
                    border: '1px solid #eee',
                    borderRadius: '4px'
                }}>
                <h4 style={{ margin: '0 0 10px 0' }}>Sample Translations:</h4>
                <ul style={{ margin: '0', paddingLeft: '20px' }}>
                    <li>
                        Header Back: <code>{t('header.back')}</code>
                    </li>
                    <li>
                        Common Submit: <code>{t('common.submit')}</code>
                    </li>
                    <li>
                        Insert Cash Title: <code>{t('insertCash.title')}</code>
                    </li>
                    <li>
                        Register Title: <code>{t('register.title')}</code>
                    </li>
                </ul>
            </div>
        </div>
    )
}
