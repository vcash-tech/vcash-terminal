# Using i18n in Storybook

This guide explains how to use internationalization (i18n) in Storybook for the VCash Terminal project.

## Overview

The Storybook configuration has been set up to support translations for all components. This allows you to:

1. View components with proper translations instead of just keys
2. Switch between languages (English and Serbian) using the language selector in the toolbar
3. Test how components look in different languages

## How It Works

The i18n integration in Storybook works through:

1. A global decorator that wraps all stories with the `I18nextProvider`
2. A language selector in the Storybook toolbar
3. Optional translation demo components to show translation information

## Using Translations in Stories

### Basic Usage

All stories automatically have access to translations. The components will use the currently selected language from the toolbar.

### Adding the Translation Demo

To explicitly show translation information in a story, use the `withTranslationDemo` decorator:

```tsx
import { withTranslationDemo } from '@/i18n/storybook/TranslationDecorator'

export const WithTranslationDemo: Story = {
  args: { /* your args */ },
  decorators: [withTranslationDemo]
}
```

## Switching Languages

To switch languages in Storybook:

1. Look for the globe icon in the Storybook toolbar
2. Click on it to open the language dropdown
3. Select either "English" or "Serbian"

All components will immediately update to show text in the selected language.

## Adding New Components

When creating new components that use translations:

1. Use the `useTranslate` hook in your component
2. Add translation keys to both `en.json` and `rs.json` files
3. Create a story that demonstrates the component with translations

## Documentation

For more detailed information about the i18n system, check out the "Documentation/Internationalization" story in Storybook.
