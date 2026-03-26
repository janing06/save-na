import { Stack } from 'expo-router';

const BudgetLayout = () => {
	return (
		<Stack
			screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
		/>
	);
};

export default BudgetLayout;
