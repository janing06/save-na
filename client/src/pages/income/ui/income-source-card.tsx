import { Pressable, Text, View } from 'react-native';
import type { IncomeSource } from '@shared/lib';
import { formatCurrency } from '@shared/lib';

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
	return (
		<Pressable
			className="bg-white rounded-2xl shadow-sm mx-4 mb-3 px-4 py-3"
			onPress={() => onEdit(source)}
			onLongPress={() => onDelete(source.id)}
		>
			<View className="flex-row justify-between items-start">
				<View className="flex-1 mr-3">
					<Text className="text-sm font-bold text-slate-900 mb-1">
						{source.name}
					</Text>
					<Text className="text-xs text-slate-500">
						{scheduleLabels[source.pay_schedule]}
					</Text>
				</View>
				<Text className="text-base font-bold text-green-600">
					{formatCurrency(source.amount, currency)}
				</Text>
			</View>
		</Pressable>
	);
}
