import type { Decorator } from '@storybook/react'

import { OrderProvider } from '@/providers/orderProvider'

/**
 * Decorator that wraps a story in an OrderProvider
 * This ensures that components that use the useOrder hook work properly in Storybook
 *
 * The decorator supports configuration through story parameters:
 *
 * @example
 * ```typescript
 * export const MyStory: Story = {
 *   parameters: {
 *     orderProvider: {
 *       initialSessionId: 'custom_session_123'
 *     }
 *   }
 * }
 * ```
 */
export const withOrderProvider: Decorator = (StoryFn, context) => {
    // Extract order provider configuration from story parameters
    const orderConfig = context.parameters?.orderProvider || {}
    const {
        initialSessionId = `storybook_session_${Date.now()}`
    } = orderConfig

    return (
        <OrderProvider initialSessionId={initialSessionId}>
            <StoryFn {...context.args} />
        </OrderProvider>
    )
}

/**
 * Decorator variant with predefined gaming session configuration
 * Useful for stories that specifically test gaming voucher flows
 */
export const withOrderProviderGaming: Decorator = (StoryFn, context) => (
    <OrderProvider initialSessionId="storybook_gaming_session">
        <StoryFn {...context.args} />
    </OrderProvider>
)

/**
 * Decorator variant with predefined betting session configuration
 * Useful for stories that specifically test betting voucher flows
 */
export const withOrderProviderBetting: Decorator = (StoryFn, context) => (
    <OrderProvider initialSessionId="storybook_betting_session">
        <StoryFn {...context.args} />
    </OrderProvider>
)

/**
 * Decorator variant with no initial session ID
 * Useful for testing components that handle missing session scenarios
 */
export const withOrderProviderEmpty: Decorator = (StoryFn, context) => (
    <OrderProvider>
        <StoryFn {...context.args} />
    </OrderProvider>
)