import { LoadingOverlay } from '@shared/ui';
import { useState } from 'react';
import { Alert } from 'react-native';
import {
	useChatMessages,
	useClearChat,
	useLocalModel,
	useSendMessage,
} from '../model/hooks';
import { ChatPage } from './chat-page';

type Props = {
	onClose: () => void;
};

export const ChatPageContainer = ({ onClose }: Props) => {
	const { model, loadContext, isLoading: isModelLoading } = useLocalModel();
	const { messages, isLoading } = useChatMessages();
	const { onSend, isSending } = useSendMessage(
		loadContext,
		model ?? null,
		messages,
	);
	const { onClearChat } = useClearChat();
	const [inputText, setInputText] = useState('');

	if (isModelLoading) {
		return <LoadingOverlay visible />;
	}

	const handleSend = () => {
		const text = inputText.trim();
		if (!text) return;
		setInputText('');
		onSend(text);
	};

	const handleClearChat = () => {
		Alert.alert(
			'Clear Chat',
			'Delete all chat messages? This cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Clear',
					style: 'destructive',
					onPress: () => onClearChat(),
				},
			],
		);
	};

	const handleSuggestionPress = (text: string) => {
		onSend(text);
	};

	return (
		<ChatPage
			messages={messages}
			isLoading={isLoading}
			isSending={isSending}
			inputText={inputText}
			onChangeText={setInputText}
			onSend={handleSend}
			onSuggestionPress={handleSuggestionPress}
			onClearChat={handleClearChat}
			onClose={onClose}
		/>
	);
};
