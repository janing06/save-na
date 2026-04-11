import Markdown from '@ronradtke/react-native-markdown-display';
import { useThemeColors } from '@shared/lib';
import { Text, View } from 'react-native';

type Props = {
	role: 'user' | 'assistant';
	content: string;
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
		heading1: { fontSize: 14, fontWeight: '700' as const, color: colors.text },
		heading2: { fontSize: 14, fontWeight: '700' as const, color: colors.text },
		heading3: { fontSize: 14, fontWeight: '700' as const, color: colors.text },
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
