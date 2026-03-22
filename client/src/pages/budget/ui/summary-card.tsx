import { formatCurrency } from '@shared/lib';
import { Text, View } from 'react-native';

type Props = {
	income: number;
	allocated: number;
	currency: string;
};

export const SummaryCard = ({ income, allocated, currency }: Props) => {
	const remaining = income - allocated;
	const allocatedPercent =
		income > 0 ? Math.min((allocated / income) * 100, 100) : 0;

	return (
		<View className="bg-white/15 rounded-2xl mx-4 p-4 mb-2">
			<View className="flex-row justify-between mb-3">
				<View>
					<Text className="text-[10px] text-white/65 uppercase tracking-widest mb-0.5">
						Income
					</Text>
					<Text className="text-xl font-extrabold text-white">
						{formatCurrency(income, currency)}
					</Text>
				</View>
				<View className="items-center">
					<Text className="text-[10px] text-white/65 uppercase tracking-widest mb-0.5">
						Allocated
					</Text>
					<Text className="text-xl font-extrabold text-white/85">
						{formatCurrency(allocated, currency)}
					</Text>
				</View>
				<View className="items-end">
					<Text className="text-[10px] text-white/65 uppercase tracking-widest mb-0.5">
						Remaining
					</Text>
					<Text className="text-xl font-extrabold text-white">
						{formatCurrency(remaining, currency)}
					</Text>
				</View>
			</View>
			{/* Progress bar */}
			<View className="bg-white/25 h-1.5 rounded-full mb-1">
				<View
					className="bg-white h-1.5 rounded-full"
					style={{ width: `${allocatedPercent}%` }}
				/>
			</View>
			<Text className="text-[10px] text-white/75">
				{Math.round(allocatedPercent)}% of income allocated
			</Text>
		</View>
	);
};
