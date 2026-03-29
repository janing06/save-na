import { formatCurrency } from '@shared/lib';
import { Text, View } from 'react-native';

type CategoryProgress = {
	name: string;
	checkedAmount: number;
	totalAmount: number;
	color: string;
};

type Props = {
	categories: CategoryProgress[];
	currency: string;
};

export const CategoryProgressBars = ({ categories, currency }: Props) => {
	return (
		<View className="bg-white rounded-2xl p-5 shadow-sm">
			<Text className="text-sm font-semibold text-slate-700 mb-4">
				Checked Progress
			</Text>

			<View className="gap-3.5">
				{categories.map((category) => {
					const percentage =
						category.totalAmount > 0
							? Math.round(
									(category.checkedAmount / category.totalAmount) * 100,
								)
							: 0;

					return (
						<View key={category.name}>
							<View className="flex-row justify-between mb-1.5">
								<Text
									className="text-xs font-medium text-slate-700 shrink"
									numberOfLines={1}
								>
									{category.name}
								</Text>
								<Text className="text-xs text-slate-500 ml-2 shrink-0">
									{formatCurrency(category.checkedAmount, currency)} /{' '}
									{formatCurrency(category.totalAmount, currency)}
								</Text>
							</View>

							{/* Progress bar */}
							<View className="h-2 bg-slate-200 rounded-full overflow-hidden">
								<View
									className="h-full rounded-full"
									style={{
										width: `${percentage}%`,
										backgroundColor: category.color,
									}}
								/>
							</View>

							<Text
								className="text-[10px] font-medium mt-0.5"
								style={{
									color: percentage === 0 ? '#94a3b8' : category.color,
								}}
							>
								{percentage === 100
									? '100% checked ✓'
									: `${percentage}% checked`}
							</Text>
						</View>
					);
				})}
			</View>
		</View>
	);
};
