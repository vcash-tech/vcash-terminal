import { Decorator } from '@storybook/react'

import { TranslationDemo } from '../../../.storybook/TranslationDemo'

/**
 * A decorator that adds a translation demo panel to a story
 * This can be used to show translation information in specific stories
 */
export const withTranslationDemo: Decorator = (Story) => {
  return (
    <div>
      <TranslationDemo />
      <Story />
    </div>
  )
}
