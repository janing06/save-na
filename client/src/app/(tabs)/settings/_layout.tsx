import { Stack } from 'expo-router';
import { Platform } from 'react-native';

const SettingsLayout = () => {
	return (
		<Stack
			screenOptions={({ route }) => ({
				headerShown: false,
				animation: 'slide_from_right',
				...(Platform.OS === 'android' && route.name === 'category-form'
					? { statusBarStyle: 'dark' }
					: {}),
			})}
		/>
	);
};

export default SettingsLayout;
