import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@shared/lib';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StatusBar,
	Text,
	TextInput,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
	onSaveKey: (key: string) => void;
	onClose: () => void;
};

export const ChatSetupPrompt = ({ onSaveKey, onClose }: Props) => {
	const [key, setKey] = useState('');
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const colors = useThemeColors();
	const { colorScheme } = useColorScheme();

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
			<StatusBar
				barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
			/>
			<View className="px-5 py-4 flex-row items-center">
				<Pressable onPress={onClose} className="active:opacity-60">
					<Ionicons name="arrow-back" size={24} color={colors.text} />
				</Pressable>
			</View>

			<View
				className="flex-1 justify-center px-6"
				style={
					Platform.OS === 'android'
						? { marginBottom: keyboardHeight }
						: undefined
				}
			>
				<Text className="text-lg font-bold text-slate-900 dark:text-slate-100 text-center mb-2">
					Set Up AI Assistant
				</Text>
				<Text className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
					Get a free API key to use the budget chat assistant
				</Text>

				<View className="bg-slate-50 dark:bg-zinc-900 rounded-2xl px-4 py-5 mb-4">
					<Text className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
						How to get your free key:
					</Text>
					<Text className="text-sm text-slate-500 dark:text-slate-400 mb-1">
						1. Go to openrouter.ai and sign up (free)
					</Text>
					<Text className="text-sm text-slate-500 dark:text-slate-400 mb-1">
						2. Go to Keys and create a new key
					</Text>
					<Text className="text-sm text-slate-500 dark:text-slate-400 mb-4">
						3. Copy the key and paste it below
					</Text>

					<TextInput
						className="bg-white dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100"
						placeholder="Paste your OpenRouter API key"
						placeholderTextColor={colors.muted}
						value={key}
						onChangeText={setKey}
						autoCapitalize="none"
						autoCorrect={false}
						secureTextEntry
					/>
				</View>

				<Pressable
					onPress={() => {
						const trimmed = key.trim();
						if (trimmed) onSaveKey(trimmed);
					}}
					className="bg-teal-600 rounded-xl py-3.5 active:opacity-80"
					disabled={!key.trim()}
				>
					<Text className="text-white font-semibold text-center">Save Key</Text>
				</Pressable>
			</View>
		</>
	);

	return (
		<SafeAreaView
			edges={['top', 'bottom']}
			className="flex-1 bg-white dark:bg-zinc-900"
		>
			{Platform.OS === 'ios' ? (
				<KeyboardAvoidingView className="flex-1" behavior="padding">
					{content}
				</KeyboardAvoidingView>
			) : (
				content
			)}
		</SafeAreaView>
	);
};
