import { useState } from 'react';
import { Alert } from 'react-native';
import {
	useChatMessages,
	useSendMessage,
	useApiKey,
	useClearChat,
} from '../model/hooks';
import { ChatPage } from './chat-page';
import { ChatSetupPrompt } from './chat-setup-prompt';

export const ChatPageContainer = () => {
	const { apiKey, onSaveKey } = useApiKey();
	const { messages } = useChatMessages();
	const { onSend, isSending } = useSendMessage(apiKey, messages);
	const { onClearChat } = useClearChat();
	const [inputText, setInputText] = useState('');

	if (!apiKey) {
		return <ChatSetupPrompt onSaveKey={onSaveKey} />;
	}

	const handleSend = async () => {
		const text = inputText.trim();
		if (!text) return;
		setInputText('');
		await onSend(text);
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

	return (
		<ChatPage
			messages={messages}
			isSending={isSending}
			inputText={inputText}
			onChangeText={setInputText}
			onSend={handleSend}
			onClearChat={handleClearChat}
		/>
	);
};
