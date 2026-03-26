import { Stack } from 'expo-router';
import { Platform } from 'react-native';

const IncomeLayout = () => {
	return (
		<Stack
			screenOptions={({ route }) => ({
				headerShown: false,
				animation: 'slide_from_right',
				...(Platform.OS === 'android' && route.name === 'income-source-form'
					? { statusBarStyle: 'dark' }
					: {}),
			})}
		/>
	);
};

export default IncomeLayout;
