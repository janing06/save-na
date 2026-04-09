import Markdown from '@ronradtke/react-native-markdown-display';
import { useThemeColors } from '@shared/lib';
import { Text, View } from 'react-native';

type Props = {
	role: 'user' | 'assistant';
	content: string;
};

const _userStyles = {
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
};

export const ChatBubble = ({ role, content }: Props) => {
	const isUser = role === 'user';
	const colors = useThemeColors();

	const assistantStyles = {
		body: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
		strong: { color: colors.text, fontWeight: '700' as const },
		em: { color: colors.textSecondary },
		link: { color: colors.brand },
		bullet_list_icon: { color: colors.textSecondary },
		ordered_list_icon: { color: colors.textSecondary },
		code_inline: {
			backgroundColor: colors.surface,
			color: colors.text,
			fontSize: 13,
		},
		fence: {
			backgroundColor: colors.surface,
			color: colors.text,
			fontSize: 13,
			borderColor: colors.card,
		},
		paragraph: { marginTop: 0, marginBottom: 4 },
	};

	return (
		<View
			className={`mb-3 ${isUser ? 'self-end max-w-[85%]' : 'self-stretch'}`}
		>
			<View
				className={`px-4 py-3 rounded-2xl ${
					isUser
						? 'bg-teal-600 rounded-br-sm'
						: 'bg-white dark:bg-zinc-900 rounded-bl-sm'
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
