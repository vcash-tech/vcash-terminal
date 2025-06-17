# Internationalization (i18n) in VCash Terminal

This document provides an overview of how internationalization is implemented in the VCash Terminal application.

## Overview

The application supports multiple languages (currently English and Serbian) using the `i18next` library with React bindings (`react-i18next`).

## Structure

- **Translations**: Located in `src/i18n/locales/` directory
  - `en.json` - English translations
  - `rs.json` - Serbian translations
- **Configuration**: `src/i18n/i18n.ts` - Main i18n configuration
- **Provider**: `src/i18n/TranslationProvider.tsx` - React context provider for translations
- **Hooks**: `src/i18n/useTranslate.ts` - Custom hook for easier translation usage

## Usage

### Basic Translation

```tsx
import { useTranslate } from '@/i18n/useTranslate'

function MyComponent() {
  const { t } = useTranslate()
  
  return <h1>{t('header.title')}</h1>
}
```

### Switching Languages

```tsx
import { useTranslate } from '@/i18n/useTranslate'

function LanguageSwitcher() {
  const { changeLanguage, isLanguageActive } = useTranslate()
  
  return (
    <div>
      <button 
        onClick={() => changeLanguage('en')}
        className={isLanguageActive('en') ? 'active' : ''}
      >
        English
      </button>
      <button 
        onClick={() => changeLanguage('rs')}
        className={isLanguageActive('rs') ? 'active' : ''}
      >
        Serbian
      </button>
    </div>
  )
}
```

### Using Variables in Translations

```tsx
// In translation file:
// "welcome": "Welcome, {{name}}!"

import { useTranslate } from '@/i18n/useTranslate'

function Welcome({ name }) {
  const { t } = useTranslate()
  
  return <p>{t('welcome', { name })}</p>
}
```

## Adding New Translations

1. Add new translation keys to both language files (`en.json` and `rs.json`)
2. Use a nested structure for organization (e.g., `"header": { "title": "My Title" }`)
3. Access translations using dot notation (e.g., `t('header.title')`)

## Language Persistence

The application automatically saves the user's language preference in localStorage. The selected language will persist across page refreshes and browser sessions.

## Adding a New Language

To add a new language:

1. Create a new translation file in `src/i18n/locales/` (e.g., `de.json` for German)
2. Add the language to the resources in `src/i18n/i18n.ts`:

```ts
const resources = {
  en: { translation: en },
  rs: { translation: rs },
  de: { translation: de }  // Add the new language
}
```

3. Add a language selector button in the Header component
