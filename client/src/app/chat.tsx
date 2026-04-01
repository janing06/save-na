import { ChatPageContainer } from '@pages/chat';
import { useRouter } from 'expo-router';

const ChatScreen = () => {
	const router = useRouter();

	return <ChatPageContainer onClose={() => router.back()} />;
};

export default ChatScreen;
