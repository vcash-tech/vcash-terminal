import type { Decorator } from '@storybook/react'

import { KeyboardProvider } from '@/context/KeyboardContext'

/**
 * Decorator that wraps a story in a KeyboardProvider
 * This ensures that components that use the useKeyboard hook work properly in Storybook
 */
export const withKeyboardProvider: Decorator = (StoryFn, context) => (
    <KeyboardProvider>
        <StoryFn {...context.args} />
    </KeyboardProvider>
)
