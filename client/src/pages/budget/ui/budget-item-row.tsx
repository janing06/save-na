import { Pressable, Text, View } from 'react-native';
import { formatCurrency } from '@shared/lib';
import type { BudgetItemAllocation } from '@shared/lib';

type Props = {
	name: string;
	amount: number;
	allocation: BudgetItemAllocation | null;
	currency: string;
	onPress: () => void;
	onTogglePaid: (allocationId: number) => void;
	showCheckbox: boolean;
};

export function BudgetItemRow({
	name,
	amount,
	allocation,
	currency,
	onPress,
	onTogglePaid,
	showCheckbox,
}: Props) {
	const isPaid = allocation?.is_paid === 1;

	return (
		<Pressable className="flex-row items-center px-4 py-2.5" onPress={onPress}>
			{showCheckbox && allocation && (
				<Pressable className="mr-3" onPress={() => onTogglePaid(allocation.id)}>
					<Text className="text-lg text-slate-400">{isPaid ? '☑' : '☐'}</Text>
				</Pressable>
			)}
			<Text
				className={`flex-1 text-xs ${isPaid ? 'text-slate-400 line-through' : 'text-slate-700'}`}
			>
				{name}
			</Text>
			<Text
				className={`text-xs font-semibold ${isPaid ? 'text-slate-400' : 'text-slate-700'}`}
			>
				{formatCurrency(amount, currency)}
			</Text>
		</Pressable>
	);
}
