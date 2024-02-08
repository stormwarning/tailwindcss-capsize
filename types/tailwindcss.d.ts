declare module 'tailwindcss'

declare module 'tailwindcss/plugin' {
	import type {
		CreatePlugin,
		PluginTools as BasePluginTools,
		NestedObject,
		ThemeValue,
		Variants,
	} from '@navith/tailwindcss-plugin-author-types'

	const createPlugin: CreatePlugin
	export default createPlugin

	interface MatchUtilitiesOptions {
		values: ThemeValue
		type: string[]
		variants?: Variants
	}
	export declare type PluginTools = BasePluginTools & {
		matchUtilities: (utilities: NestedObject, options: MatchUtilitiesOptions) => void
	}
}
