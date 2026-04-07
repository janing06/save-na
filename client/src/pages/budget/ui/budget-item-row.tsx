import { Ionicons } from '@expo/vector-icons';
import type { BudgetItemAllocation } from '@shared/lib';
import { formatCurrency, ordinal } from '@shared/lib';
import { Pressable, Text } from 'react-native';

type Props = {
	name: string;
	amount: number;
	allocation: BudgetItemAllocation | null;
	currency: string;
	onPress: () => void;
	onTogglePaid: (allocationId: number) => void;
	showCheckbox: boolean;
	sourceLabel?: string;
	dueDay?: number | null;
	isOverdue?: boolean;
};

export const BudgetItemRow = ({
	name,
	amount,
	allocation,
	currency,
	onPress,
	onTogglePaid,
	showCheckbox,
	sourceLabel,
	dueDay,
	isOverdue,
}: Props) => {
	const isPaid = allocation?.is_paid === 1;

	return (
		<Pressable
			className="flex-row items-center px-4 py-2.5"
			onPress={
				showCheckbox && allocation ? () => onTogglePaid(allocation.id) : onPress
			}
		>
			{showCheckbox && allocation && (
				<Pressable
					className="mr-3"
					hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
					onPress={() => onTogglePaid(allocation.id)}
				>
					<Ionicons
						name={isPaid ? 'checkbox' : 'square-outline'}
						size={20}
						color={isPaid ? '#0d9488' : '#94a3b8'}
					/>
				</Pressable>
			)}
			<Pressable
				className="flex-1"
				onPress={
					showCheckbox && allocation
						? () => onTogglePaid(allocation.id)
						: onPress
				}
			>
				<Text
					className={`text-xs ${isPaid ? 'text-slate-400 line-through' : 'text-slate-700'}`}
				>
					{name}
				</Text>
				{sourceLabel && (
					<Text className="text-xs text-slate-400">{sourceLabel}</Text>
				)}
				{dueDay != null && (
					<Text
						className={`text-xs ${isOverdue && !isPaid ? 'text-red-500' : 'text-slate-400'}`}
					>
						Due {ordinal(dueDay)}
					</Text>
				)}
			</Pressable>
			<Text
				className={`text-xs font-semibold ${isPaid ? 'text-slate-400' : 'text-slate-700'}`}
			>
				{formatCurrency(amount, currency)}
			</Text>
		</Pressable>
	);
};
