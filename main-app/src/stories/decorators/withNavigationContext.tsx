import type { Decorator } from '@storybook/react'

import { NavigationProvider } from '@/hooks/useNavigationContext'

/**
 * Decorator that wraps a story in a KeyboardProvider
 * This ensures that components that use the useKeyboard hook work properly in Storybook
 */
export const withNavigationContext: Decorator = (StoryFn, context) => (
    <NavigationProvider>
        <StoryFn {...context.args} />
    </NavigationProvider>
)