import type { PayPeriod } from '@shared/lib';
import { Pressable, ScrollView, Text } from 'react-native';

type Props = {
	periods: PayPeriod[];
	selectedIndex: number | 'full';
	onSelect: (index: number | 'full') => void;
};

export const PayPeriodToggle = ({
	periods,
	selectedIndex,
	onSelect,
}: Props) => {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			className="mb-3"
			contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
		>
			<Pressable
				className={`px-4 py-1.5 rounded-full ${
					selectedIndex === 'full'
						? 'bg-teal-600'
						: 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800'
				}`}
				onPress={() => onSelect('full')}
			>
				<Text
					className={`text-xs font-semibold ${
						selectedIndex === 'full'
							? 'text-white'
							: 'text-slate-500 dark:text-slate-400'
					}`}
				>
					Full Month
				</Text>
			</Pressable>
			{periods.map((period) => (
				<Pressable
					key={period.index}
					className={`px-4 py-1.5 rounded-full ${
						selectedIndex === period.index
							? 'bg-teal-600'
							: 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800'
					}`}
					onPress={() => onSelect(period.index)}
				>
					<Text
						className={`text-xs font-semibold ${
							selectedIndex === period.index
								? 'text-white'
								: 'text-slate-500 dark:text-slate-400'
						}`}
					>
						{period.label}
					</Text>
				</Pressable>
			))}
		</ScrollView>
	);
};
