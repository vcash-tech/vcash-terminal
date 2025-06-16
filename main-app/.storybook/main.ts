import type { StorybookConfig } from '@storybook/react-vite'

/**
 * This function was used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 * NOTE: Currently commented out as it was causing path resolution issues.
 */
// function getAbsolutePath(value: string): string {
//     // For ES modules, we need to use import.meta.resolve instead of require.resolve
//     // But since import.meta.resolve is not available in all environments, we'll use a workaround
//     const moduleUrl = new URL(join(value, 'package.json'), import.meta.url)
//     return dirname(fileURLToPath(moduleUrl))
// }

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-onboarding',
        '@storybook/addon-interactions'
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {}
    },
    docs: {
        autodocs: true
    },
    viteFinal: (config) => {
        // Add optimizeDeps exclude configuration
        return {
            ...config,
            optimizeDeps: {
                ...config.optimizeDeps,
                exclude: [
                    ...(config.optimizeDeps?.exclude || []),
                    '@storybook/blocks',
                    '@storybook/addon-essentials',
                    '@storybook/addon-interactions',
                    '@storybook/addon-onboarding',
                    '@storybook/react',
                    '@storybook/react-dom',
                    '@storybook/preview-api',
                    '@storybook/manager-api',
                    '@storybook/theming',
                    '@storybook/channels',
                    '@storybook/client-logger',
                    '@storybook/core-events',
                    '@storybook/router',
                    '@storybook/components',
                    '@storybook/global',
                    '@storybook/types',
                    '@storybook/docs-tools',
                    '@mdx-js/react'
                ],
                // Force include necessary dependencies
                include: [...(config.optimizeDeps?.include || []), 'react', 'react-dom']
            },
            build: {
                ...config.build,
                // Improve compatibility
                commonjsOptions: {
                    ...(config.build?.commonjsOptions || {}),
                    transformMixedEsModules: true
                }
            },
            // Prevent breaking on circular dependencies
            esbuild: {
                ...(config.esbuild || {}),
                logOverride: {
                    ...((typeof config.esbuild === 'object' && config.esbuild?.logOverride) || {}),
                    'circular-dependency': 'silent'
                }
            },
            // Solve issues with some modules
            resolve: {
                ...config.resolve,
                dedupe: [...(config.resolve?.dedupe || []), 'react', 'react-dom']
            }
        }
    }
}

export default config
