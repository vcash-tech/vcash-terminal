import type { Decorator } from '@storybook/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

/**
 * Decorator that wraps a story in a NavigationProvider
 * This ensures that components that use the useNavigation hook work properly in Storybook
 */
export const withNavigationProvider: Decorator = (StoryFn, context) => (
    <MemoryRouter>
        <Routes>
            <Route path="*" element={<StoryFn {...context.args} />} />
        </Routes>
    </MemoryRouter>
)
