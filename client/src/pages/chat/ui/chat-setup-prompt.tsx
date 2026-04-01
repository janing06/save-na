import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StatusBar, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
	onSaveKey: (key: string) => void;
	onClose: () => void;
};

export const ChatSetupPrompt = ({ onSaveKey, onClose }: Props) => {
	const [key, setKey] = useState('');

	return (
		<SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
			<StatusBar />
			<View className="px-5 py-4 flex-row items-center">
				<Pressable onPress={onClose} className="active:opacity-60">
					<Ionicons name="arrow-back" size={24} color="black" />
				</Pressable>
			</View>

			<View className="flex-1 justify-center px-6">
				<Text className="text-lg font-bold text-slate-800 text-center mb-2">
					Set Up AI Assistant
				</Text>
				<Text className="text-sm text-slate-500 text-center mb-6">
					Get a free API key to use the budget chat assistant
				</Text>

				<View className="bg-slate-50 rounded-2xl px-4 py-5 mb-4">
					<Text className="text-sm font-medium text-slate-700 mb-3">
						How to get your free key:
					</Text>
					<Text className="text-sm text-slate-500 mb-1">
						1. Go to openrouter.ai and sign up (free)
					</Text>
					<Text className="text-sm text-slate-500 mb-1">
						2. Go to Keys and create a new key
					</Text>
					<Text className="text-sm text-slate-500 mb-4">
						3. Copy the key and paste it below
					</Text>

					<TextInput
						className="bg-white rounded-xl px-4 py-3 text-sm text-slate-800"
						placeholder="Paste your OpenRouter API key"
						placeholderTextColor="#94a3b8"
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
		</SafeAreaView>
	);
};
