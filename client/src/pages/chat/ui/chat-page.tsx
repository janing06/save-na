import { useRef, useEffect } from 'react';
import {
	ActivityIndicator,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	TextInput,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { ChatMessage } from '@shared/lib';
import { ChatBubble } from './chat-bubble';

type Props = {
	messages: ChatMessage[];
	isSending: boolean;
	inputText: string;
	onChangeText: (text: string) => void;
	onSend: () => void;
	onClearChat: () => void;
};

export const ChatPage = ({
	messages,
	isSending,
	inputText,
	onChangeText,
	onSend,
	onClearChat,
}: Props) => {
	const flatListRef = useRef<FlatList>(null);

	// Messages come from DB in DESC order, reverse for display
	const sortedMessages = [...messages].reverse();

	useEffect(() => {
		if (sortedMessages.length > 0) {
			setTimeout(
				() => flatListRef.current?.scrollToEnd({ animated: true }),
				100,
			);
		}
	}, [sortedMessages.length]);

	return (
		<View className="flex-1 bg-teal-600">
			<SafeAreaView edges={['top']} className="bg-teal-600">
				<View className="px-5 py-4 flex-row items-center justify-between">
					<Text className="text-xl font-bold text-white">Chat</Text>
					{messages.length > 0 && (
						<Pressable onPress={onClearChat} className="active:opacity-60">
							<Ionicons name="trash-outline" size={20} color="#ffffff" />
						</Pressable>
					)}
				</View>
			</SafeAreaView>

			<KeyboardAvoidingView
				className="flex-1 bg-slate-100 rounded-t-3xl -mt-4 overflow-hidden"
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				keyboardVerticalOffset={0}
			>
				<FlatList
					ref={flatListRef}
					data={sortedMessages}
					keyExtractor={(item) => String(item.id)}
					renderItem={({ item }) => (
						<ChatBubble role={item.role} content={item.content} />
					)}
					contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
					ListEmptyComponent={
						<View className="flex-1 justify-center items-center pt-20">
							<Text className="text-slate-400 text-sm text-center">
								Ask me anything about your budget!
							</Text>
						</View>
					}
				/>

				{isSending && (
					<View className="px-4 pb-2 flex-row items-center">
						<ActivityIndicator size="small" color="#0d9488" />
						<Text className="text-xs text-slate-400 ml-2">Thinking...</Text>
					</View>
				)}

				<SafeAreaView
					edges={['bottom']}
					className="bg-white border-t border-slate-200"
				>
					<View className="flex-row items-end px-4 py-2">
						<TextInput
							className="flex-1 bg-slate-100 rounded-2xl px-4 py-2.5 text-sm text-slate-800 max-h-[100px]"
							placeholder="Ask about your budget..."
							placeholderTextColor="#94a3b8"
							value={inputText}
							onChangeText={onChangeText}
							multiline
							editable={!isSending}
						/>
						<Pressable
							onPress={onSend}
							disabled={isSending || !inputText.trim()}
							className="ml-2 bg-teal-600 rounded-full w-10 h-10 items-center justify-center active:opacity-80"
						>
							<Ionicons name="send" size={18} color="#ffffff" />
						</Pressable>
					</View>
				</SafeAreaView>
			</KeyboardAvoidingView>
		</View>
	);
};
