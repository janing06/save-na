import { ChatPageContainer } from '@pages/chat';
import { useRouter } from 'expo-router';

const BudgetChatScreen = () => {
	const router = useRouter();

	return <ChatPageContainer onClose={() => router.back()} />;
};

export default BudgetChatScreen;
