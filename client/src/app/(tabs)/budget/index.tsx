import { BudgetPageContainer } from '@pages/budget';
import { useRouter } from 'expo-router';

const BudgetScreen = () => {
	const router = useRouter();

	return <BudgetPageContainer onOpenChat={() => router.push('/chat')} />;
};

export default BudgetScreen;
