import { Text, View } from 'react-native';

type Props = {
	role: 'user' | 'assistant';
	content: string;
};

export const ChatBubble = ({ role, content }: Props) => {
	const isUser = role === 'user';

	return (
		<View className={`mb-3 max-w-[85%] ${isUser ? 'self-end' : 'self-start'}`}>
			<View
				className={`px-4 py-3 rounded-2xl ${
					isUser ? 'bg-teal-600 rounded-br-sm' : 'bg-white rounded-bl-sm'
				}`}
			>
				<Text
					className={`text-sm leading-5 ${isUser ? 'text-white' : 'text-slate-700'}`}
				>
					{content}
				</Text>
			</View>
		</View>
	);
};
