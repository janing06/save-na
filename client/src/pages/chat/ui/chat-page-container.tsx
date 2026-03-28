import { useState } from 'react';
import { Alert } from 'react-native';
import {
	useApiKey,
	useChatMessages,
	useClearChat,
	useSendMessage,
} from '../model/hooks';
import { ChatPage } from './chat-page';
import { ChatSetupPrompt } from './chat-setup-prompt';

export const ChatPageContainer = () => {
	const { apiKey, onSaveKey } = useApiKey();
	const { messages, isLoading } = useChatMessages();
	const { onSend, isSending } = useSendMessage(apiKey, messages);
	const { onClearChat } = useClearChat();
	const [inputText, setInputText] = useState('');

	if (!apiKey) {
		return <ChatSetupPrompt onSaveKey={onSaveKey} />;
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
		/>
	);
};
