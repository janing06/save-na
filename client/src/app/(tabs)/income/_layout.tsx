import { Stack } from 'expo-router';

const IncomeLayout = () => {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: 'slide_from_right',
			}}
		/>
	);
};

export default IncomeLayout;
