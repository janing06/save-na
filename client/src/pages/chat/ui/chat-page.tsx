import { Ionicons } from '@expo/vector-icons';
import type { ChatMessage } from '@shared/lib';
import { useEffect, useRef, useState } from 'react';
import {
	FlatList,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	TextInput,
	View,
} from 'react-native';
import Animated, {
	cancelAnimation,
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingOverlay } from '@shared/ui';
import { ChatBubble } from './chat-bubble';

const Dot = ({ delay }: { delay: number }) => {
	const translateY = useSharedValue(0);

	useEffect(() => {
		translateY.value = withDelay(
			delay,
			withRepeat(
				withSequence(
					withTiming(-6, { duration: 300, easing: Easing.out(Easing.quad) }),
					withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) }),
					withDelay(600, withTiming(0, { duration: 0 })),
				),
				-1,
			),
		);

		return () => cancelAnimation(translateY);
	}, [delay, translateY]);

	const style = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	return (
		<Animated.View
			style={style}
			className="w-2 h-2 rounded-full bg-slate-400"
		/>
	);
};

const TypingIndicator = () => (
	<View className="mb-3 self-start">
		<View className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white flex-row items-center gap-1.5">
			<Dot delay={0} />
			<Dot delay={150} />
			<Dot delay={300} />
		</View>
	</View>
);

const SUGGESTIONS = [
	'How is my budget looking?',
	'Where can I cut expenses?',
	'Am I saving enough?',
	'Break down my spending',
	'Tips to save more money',
];

type Props = {
	messages: ChatMessage[];
	isLoading: boolean;
	isSending: boolean;
	inputText: string;
	onChangeText: (text: string) => void;
	onSend: () => void;
	onSuggestionPress: (text: string) => void;
	onClearChat: () => void;
};

export const ChatPage = ({
	messages,
	isLoading,
	isSending,
	inputText,
	onChangeText,
	onSend,
	onSuggestionPress,
	onClearChat,
}: Props) => {
	const flatListRef = useRef<FlatList>(null);
	const [keyboardHeight, setKeyboardHeight] = useState(0);

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

	useEffect(() => {
		if (Platform.OS !== 'android') return;

		const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
			setKeyboardHeight(e.endCoordinates.height);
		});
		const hideSub = Keyboard.addListener('keyboardDidHide', () => {
			setKeyboardHeight(0);
		});

		return () => {
			showSub.remove();
			hideSub.remove();
		};
	}, []);

	const content = (
		<>
			<FlatList
				ref={flatListRef}
				data={sortedMessages}
				keyExtractor={(item) => String(item.id)}
				renderItem={({ item }) => (
					<ChatBubble role={item.role} content={item.content} />
				)}
				ListFooterComponent={isSending ? <TypingIndicator /> : null}
				style={{ flex: 1 }}
				contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
				ListEmptyComponent={
					!isSending ? (
						// biome-ignore lint/a11y/useValidAriaRole: role is a custom prop, not an ARIA role
						<ChatBubble
							role="assistant"
							content={`Hi! I'm SaveNa, your personal budget assistant. 👋\n\nI can see your income sources, budget items, and spending history. Ask me anything — like how your budget is looking, where you can save more, or how this month compares to last month. 💸`}
						/>
					) : null
				}
			/>

			{/* Bottom section: suggestions + input */}
			<View>
				{!isSending && (
					<FlatList
						horizontal
						data={SUGGESTIONS}
						keyExtractor={(item) => item}
						showsHorizontalScrollIndicator={false}
						style={{
							maxHeight: 52,
							paddingBlock: 4,
							backgroundColor: 'white',
						}}
						contentContainerStyle={{
							paddingHorizontal: 16,
							alignItems: 'center',
						}}
						renderItem={({ item }) => (
							<Pressable
								onPress={() => onSuggestionPress(item)}
								className="bg-teal-50 border border-teal-200 rounded-full px-4 py-3 mr-2.5 active:opacity-60"
							>
								<Text className="text-sm font-medium text-teal-700">
									{item}
								</Text>
							</Pressable>
						)}
					/>
				)}

				<SafeAreaView
					edges={['bottom']}
					className="bg-white border-t border-slate-200"
				>
					<View
						className="flex-row items-end px-4 py-2"
						style={
							Platform.OS === 'android'
								? { marginBottom: keyboardHeight }
								: undefined
						}
					>
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
			</View>
		</>
	);

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

			{Platform.OS === 'ios' ? (
				<KeyboardAvoidingView
					className="flex-1 bg-slate-100 rounded-t-3xl -mt-4 overflow-hidden"
					behavior="padding"
				>
					{content}
				</KeyboardAvoidingView>
			) : (
				<View className="flex-1 bg-slate-100 rounded-t-3xl -mt-4 overflow-hidden">
					{content}
				</View>
			)}
			<LoadingOverlay visible={isLoading} />
		</View>
	);
};
