import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/lib';
import { listChatMessages } from '../../api/chat-db';

export const useChatMessages = () => {
	const { data: messages = [], ...rest } = useQuery({
		queryKey: queryKeys.chatMessages,
		queryFn: () => listChatMessages(50),
	});

	return { messages, ...rest };
};
