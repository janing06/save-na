import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

type Props = {
	onSaveKey: (key: string) => void;
};

export const ChatSetupPrompt = ({ onSaveKey }: Props) => {
	const [key, setKey] = useState('');

	return (
		<View className="flex-1 justify-center px-6">
			<Text className="text-lg font-bold text-slate-800 text-center mb-2">
				Set Up AI Assistant
			</Text>
			<Text className="text-sm text-slate-500 text-center mb-6">
				Get a free API key to use the budget chat assistant
			</Text>

			<View className="bg-white rounded-2xl px-4 py-5 mb-4">
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
					className="bg-slate-100 rounded-xl px-4 py-3 text-sm text-slate-800"
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
	);
};
