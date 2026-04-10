import { LoadingOverlay } from '@shared/ui';
import { useState } from 'react';
import { Alert } from 'react-native';
import {
	useChatMessages,
	useClearChat,
	useDeviceCapability,
	useLocalModel,
	useModelDownload,
	useSendMessage,
} from '../model/hooks';
import { ChatPage } from './chat-page';
import { DeviceNotSupported } from './device-not-supported';
import { ModelSetupScreen } from './model-setup-screen';

type Props = {
	onClose: () => void;
};

export const ChatPageContainer = ({ onClose }: Props) => {
	const { capability, isLoading: isCapabilityLoading } = useDeviceCapability();
	const {
		model,
		selectedModelId,
		isLoading: isModelLoading,
		selectModel,
		loadContext,
	} = useLocalModel();
	const { messages, isLoading } = useChatMessages();
	const { onSend, isSending, partialResponse } = useSendMessage(
		loadContext,
		model ?? null,
		messages,
	);
	const { onClearChat } = useClearChat();
	const {
		isDownloading,
		progress,
		download,
		cancel: cancelDownload,
	} = useModelDownload();
	const [inputText, setInputText] = useState('');
	const [downloadingModelId, setDownloadingModelId] = useState<string | null>(
		null,
	);

	if (isCapabilityLoading || isModelLoading) {
		return <LoadingOverlay visible />;
	}

	if (!capability?.supported) {
		return <DeviceNotSupported onClose={onClose} />;
	}

	if (!selectedModelId || !model) {
		return (
			<ModelSetupScreen
				capability={capability}
				isDownloading={isDownloading}
				downloadingModelId={downloadingModelId}
				downloadProgress={progress}
				onDownload={async (m) => {
					setDownloadingModelId(m.id);
					const success = await download(m, capability.freeStorage);
					setDownloadingModelId(null);
					if (success) {
						selectModel(m.id);
					}
				}}
				onCancelDownload={() => {
					cancelDownload();
					setDownloadingModelId(null);
				}}
				onClose={onClose}
			/>
		);
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

	return (
		<ChatPage
			messages={messages}
			isLoading={isLoading}
			isSending={isSending}
			partialResponse={partialResponse}
			inputText={inputText}
			onChangeText={setInputText}
			onSend={handleSend}
			onSuggestionPress={(text) => onSend(text)}
			onClearChat={handleClearChat}
			onClose={onClose}
		/>
	);
};
