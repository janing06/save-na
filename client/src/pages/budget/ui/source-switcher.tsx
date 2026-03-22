import type { IncomeSource } from '@shared/lib';
import { Pressable, ScrollView, Text } from 'react-native';

type Props = {
	sources: IncomeSource[];
	selectedId: number | 'total' | null;
	onSelect: (id: number | 'total') => void;
};

export const SourceSwitcher = ({ sources, selectedId, onSelect }: Props) => {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			className="px-4 mb-3"
			contentContainerStyle={{ gap: 8 }}
		>
			{sources.map((source) => (
				<Pressable
					key={source.id}
					className={`px-4 py-1.5 rounded-full ${
						selectedId === source.id ? 'bg-white' : 'bg-white/20'
					}`}
					onPress={() => onSelect(source.id)}
				>
					<Text
						className={`text-xs font-semibold ${
							selectedId === source.id ? 'text-teal-600' : 'text-white'
						}`}
					>
						{source.name}
					</Text>
				</Pressable>
			))}
			<Pressable
				className={`px-4 py-1.5 rounded-full ${
					selectedId === 'total' ? 'bg-white' : 'bg-white/20'
				}`}
				onPress={() => onSelect('total')}
			>
				<Text
					className={`text-xs font-semibold ${
						selectedId === 'total' ? 'text-teal-600' : 'text-white'
					}`}
				>
					Total
				</Text>
			</Pressable>
		</ScrollView>
	);
};
