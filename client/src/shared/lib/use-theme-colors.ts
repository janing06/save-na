import { useColorScheme } from 'nativewind';

// Hex equivalents of CSS variables in global.css — keep in sync
const lightColors = {
	brand: '#0d9488',
	muted: '#94a3b8',
	danger: '#ef4444',
	success: '#16a34a',
	text: '#0f172a',
	textSecondary: '#64748b',
	surface: '#f1f5f9',
	card: '#ffffff',
};

const darkColors = {
	brand: '#2dd4bf',
	muted: '#71717a',
	danger: '#f87171',
	success: '#22c55e',
	text: '#f4f4f5',
	textSecondary: '#a1a1aa',
	surface: '#000000',
	card: '#18181b',
};

export const useThemeColors = () => {
	const { colorScheme } = useColorScheme();
	return colorScheme === 'dark' ? darkColors : lightColors;
};
