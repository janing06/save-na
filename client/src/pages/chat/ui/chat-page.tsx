import { Ionicons } from '@expo/vector-icons';
import type { ChatMessage } from '@shared/lib';
import { useThemeColors } from '@shared/lib';
import { LoadingOverlay } from '@shared/ui';
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
			className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"
		/>
	);
};

const TypingIndicator = () => (
	<View className="mb-3 self-start">
		<View className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white dark:bg-zinc-900 flex-row items-center gap-2">
			<Text className="text-sm text-slate-500 dark:text-slate-400">
				Thinking
			</Text>
			<View className="flex-row items-center gap-1">
				<Dot delay={0} />
				<Dot delay={150} />
				<Dot delay={300} />
			</View>
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
	partialResponse: string;
	inputText: string;
	onChangeText: (text: string) => void;
	onSend: () => void;
	onSuggestionPress: (text: string) => void;
	onClearChat: () => void;
	onClose: () => void;
};

export const ChatPage = ({
	messages,
	isLoading,
	isSending,
	partialResponse,
	inputText,
	onChangeText,
	onSend,
	onSuggestionPress,
	onClearChat,
	onClose,
}: Props) => {
	const flatListRef = useRef<FlatList>(null);
	const isAtBottom = useRef(true);
	const [showScrollToBottom, setShowScrollToBottom] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const colors = useThemeColors();

	// Messages come from DB in DESC order, reverse for display
	const sortedMessages = [...messages].reverse();

	useEffect(() => {
		if (sortedMessages.length > 0) {
			const timeout = setTimeout(
				() => flatListRef.current?.scrollToEnd({ animated: true }),
				100,
			);
			return () => clearTimeout(timeout);
		}
	}, [sortedMessages.length]);

	// Auto-scroll as tokens stream in, but only if the user hasn't scrolled up
	useEffect(() => {
		if (partialResponse && isAtBottom.current) {
			flatListRef.current?.scrollToEnd({ animated: false });
		}
	}, [partialResponse]);

	// Hide scroll-to-bottom button when streaming ends
	useEffect(() => {
		if (!isSending) setShowScrollToBottom(false);
	}, [isSending]);

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
			<View className="flex-1">
				<FlatList
					ref={flatListRef}
					data={sortedMessages}
					keyExtractor={(item) => String(item.id)}
					renderItem={({ item }) => (
						<ChatBubble role={item.role} content={item.content} />
					)}
					onScrollBeginDrag={() => {
						isAtBottom.current = false;
						if (isSending) setShowScrollToBottom(true);
					}}
					onScroll={(e) => {
						const { contentOffset, contentSize, layoutMeasurement } =
							e.nativeEvent;
						const distanceFromBottom =
							contentSize.height - contentOffset.y - layoutMeasurement.height;
						if (distanceFromBottom < 50) {
							isAtBottom.current = true;
							setShowScrollToBottom(false);
						}
					}}
					scrollEventThrottle={16}
					ListFooterComponent={
						isSending ? (
							partialResponse ? (
								// biome-ignore lint/a11y/useValidAriaRole: role is a custom prop, not an ARIA role
								<ChatBubble role="assistant" content={partialResponse} />
							) : (
								<TypingIndicator />
							)
						) : null
					}
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
				{showScrollToBottom && (
					<Pressable
						onPress={() => {
							isAtBottom.current = true;
							setShowScrollToBottom(false);
							flatListRef.current?.scrollToEnd({ animated: true });
						}}
						className="absolute bottom-3 self-center bg-teal-600 rounded-full px-4 py-2 flex-row items-center gap-1.5 active:opacity-80"
						style={{
							shadowColor: '#000',
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.2,
							shadowRadius: 4,
							elevation: 4,
						}}
					>
						<Ionicons name="arrow-down" size={14} color="#ffffff" />
						<Text className="text-white text-xs font-semibold">
							Jump to latest
						</Text>
					</Pressable>
				)}
			</View>

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
							backgroundColor: colors.card,
						}}
						contentContainerStyle={{
							paddingHorizontal: 16,
							alignItems: 'center',
						}}
						renderItem={({ item }) => (
							<Pressable
								onPress={() => onSuggestionPress(item)}
								className="bg-teal-50 dark:bg-teal-950 border border-teal-200 rounded-full px-4 py-3 mr-2.5 active:opacity-60"
							>
								<Text className="text-sm font-medium text-teal-600 dark:text-teal-400">
									{item}
								</Text>
							</Pressable>
						)}
					/>
				)}

				<SafeAreaView
					edges={['bottom']}
					className="bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800"
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
							className="flex-1 bg-slate-100 dark:bg-black rounded-2xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 max-h-[100px]"
							placeholder="Ask about your budget..."
							placeholderTextColor={colors.muted}
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
		<SafeAreaView edges={['top']} className="flex-1 bg-teal-600 dark:bg-black">
			<View className="px-5 pt-4 pb-8 flex-row items-center justify-between">
				<Pressable onPress={onClose} className="active:opacity-60">
					<Ionicons name="arrow-back" size={24} color="#ffffff" />
				</Pressable>
				<Text className="text-xl font-bold text-white">Chat</Text>
				{messages.length > 0 ? (
					<Pressable onPress={onClearChat} className="active:opacity-60">
						<Ionicons name="trash-outline" size={20} color="#ffffff" />
					</Pressable>
				) : (
					<View className="w-6" />
				)}
			</View>

			{Platform.OS === 'ios' ? (
				<KeyboardAvoidingView
					className="flex-1 bg-slate-100 dark:bg-black rounded-t-3xl -mt-4 overflow-hidden"
					behavior="padding"
				>
					{content}
				</KeyboardAvoidingView>
			) : (
				<View className="flex-1 bg-slate-100 dark:bg-black rounded-t-3xl -mt-4 overflow-hidden">
					{content}
				</View>
			)}
			<LoadingOverlay visible={isLoading} />
		</SafeAreaView>
	);
};
