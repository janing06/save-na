import type { IncomeSource } from '@shared/lib';
import { formatCurrency } from '@shared/lib';
import { Pressable, Text, View } from 'react-native';

type Props = {
	source: IncomeSource;
	currency: string;
	onEdit: (source: IncomeSource) => void;
	onDelete: (id: number) => void;
};

const scheduleLabels: Record<string, string> = {
	monthly: 'Monthly',
	'bi-monthly': 'Twice a month',
	'bi-weekly': 'Every 2 weeks',
	weekly: 'Every week',
};

export const IncomeSourceCard = ({
	source,
	currency,
	onEdit,
	onDelete,
}: Props) => {
	let payDates: number[] = [];
	let payAmounts: number[] = [];
	try {
		payDates = JSON.parse(source.pay_dates);
	} catch {}
	try {
		if (source.pay_amounts) payAmounts = JSON.parse(source.pay_amounts);
	} catch {}

	const isBiMonthlyWithSplit =
		source.pay_schedule === 'bi-monthly' && payAmounts.length === 2;

	return (
		<Pressable
			className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm mx-4 mb-3 px-4 py-3"
			onPress={() => onEdit(source)}
			onLongPress={() => onDelete(source.id)}
		>
			<View className="flex-row justify-between items-start">
				<View className="flex-1 mr-3">
					<Text className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
						{source.name}
					</Text>
					<Text className="text-xs text-slate-500 dark:text-slate-400">
						{scheduleLabels[source.pay_schedule]}
					</Text>
				</View>
				<Text className="text-base font-bold text-green-600 dark:text-green-500">
					{formatCurrency(source.amount, currency)}
				</Text>
			</View>
			{isBiMonthlyWithSplit && (
				<View className="flex-row gap-3 mt-2">
					<Text className="text-xs text-slate-400 dark:text-slate-500">
						{payDates[0]}th · {formatCurrency(payAmounts[0], currency)}
					</Text>
					<Text className="text-xs text-slate-400 dark:text-slate-500">
						{payDates[1]}th · {formatCurrency(payAmounts[1], currency)}
					</Text>
				</View>
			)}
		</Pressable>
	);
};
