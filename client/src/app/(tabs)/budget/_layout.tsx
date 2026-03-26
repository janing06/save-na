import { Stack } from 'expo-router';
import { Platform } from 'react-native';

const BudgetLayout = () => {
	return (
		<Stack
			screenOptions={({ route }) => ({
				headerShown: false,
				animation: 'slide_from_right',
				...(Platform.OS === 'android' && route.name === 'budget-item-form'
					? { statusBarStyle: 'dark' }
					: {}),
			})}
		/>
	);
};

export default BudgetLayout;
