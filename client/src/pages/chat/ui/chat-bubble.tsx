import Markdown from '@ronradtke/react-native-markdown-display';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
	role: 'user' | 'assistant';
	content: string;
};

const _userStyles = StyleSheet.create({
	body: { color: '#ffffff', fontSize: 14, lineHeight: 20 },
	strong: { color: '#ffffff', fontWeight: '700' },
	em: { color: '#ffffff' },
	link: { color: '#bae6fd' },
	bullet_list_icon: { color: '#ffffff' },
	ordered_list_icon: { color: '#ffffff' },
	code_inline: {
		backgroundColor: 'rgba(255,255,255,0.15)',
		color: '#ffffff',
		fontSize: 13,
	},
	fence: {
		backgroundColor: 'rgba(255,255,255,0.1)',
		color: '#ffffff',
		fontSize: 13,
		borderColor: 'rgba(255,255,255,0.2)',
	},
	paragraph: { marginTop: 0, marginBottom: 4 },
});

const assistantStyles = StyleSheet.create({
	body: { color: '#334155', fontSize: 14, lineHeight: 20 },
	strong: { color: '#0f172a', fontWeight: '700' },
	em: { color: '#334155' },
	link: { color: '#0d9488' },
	bullet_list_icon: { color: '#64748b' },
	ordered_list_icon: { color: '#64748b' },
	code_inline: {
		backgroundColor: '#f1f5f9',
		color: '#0f172a',
		fontSize: 13,
	},
	fence: {
		backgroundColor: '#f1f5f9',
		color: '#0f172a',
		fontSize: 13,
		borderColor: '#e2e8f0',
	},
	paragraph: { marginTop: 0, marginBottom: 4 },
});

export const ChatBubble = ({ role, content }: Props) => {
	const isUser = role === 'user';

	return (
		<View
			className={`mb-3 ${isUser ? 'self-end max-w-[85%]' : 'self-stretch'}`}
		>
			<View
				className={`px-4 py-3 rounded-2xl ${
					isUser ? 'bg-teal-600 rounded-br-sm' : 'bg-white rounded-bl-sm'
				}`}
			>
				{isUser ? (
					<Text className="text-sm leading-5 text-white">{content}</Text>
				) : (
					<Markdown style={assistantStyles}>{content}</Markdown>
				)}
			</View>
		</View>
	);
};
