import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Platform } from 'react-native';

const SettingsLayout = () => {
	const { colorScheme } = useColorScheme();

	return (
		<Stack
			screenOptions={({ route }) => ({
				headerShown: false,
				animation: 'slide_from_right',
				...(Platform.OS === 'android' && route.name === 'category-form'
					? {
							statusBarStyle: colorScheme === 'dark' ? 'light' : 'dark',
						}
					: {}),
			})}
		/>
	);
};

export default SettingsLayout;
