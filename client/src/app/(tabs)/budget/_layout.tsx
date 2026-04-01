import { Stack } from 'expo-router';

const BudgetLayout = () => {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" options={{ animation: 'slide_from_right' }} />
			<Stack.Screen
				name="budget-item-form"
				options={{ animation: 'slide_from_right' }}
			/>
			<Stack.Screen name="chat" options={{ animation: 'slide_from_right' }} />
		</Stack>
	);
};

export default BudgetLayout;
