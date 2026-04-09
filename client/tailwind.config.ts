import type { Config } from 'tailwindcss';

export default {
	darkMode: 'class',
	content: ['./src/**/*.{ts,tsx}'],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {
			fontFamily: {
				sans: ['PlusJakartaSans_400Regular'],
				'sans-medium': ['PlusJakartaSans_500Medium'],
				'sans-semibold': ['PlusJakartaSans_600SemiBold'],
				'sans-bold': ['PlusJakartaSans_700Bold'],
			},
		},
	},
	plugins: [],
} satisfies Config;
