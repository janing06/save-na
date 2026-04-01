import { BudgetPageContainer } from '@pages/budget';
import { useRouter } from 'expo-router';

const BudgetScreen = () => {
	const router = useRouter();

	return (
		<BudgetPageContainer
			onOpenChat={() => router.push('/(tabs)/budget/chat')}
		/>
	);
};

export default BudgetScreen;
