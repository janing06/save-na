import { Ionicons } from '@expo/vector-icons';
import type { Category, PayPeriod, SplitType } from '@shared/lib';
import { ordinal, useThemeColors } from '@shared/lib';
import { useEffect, useState } from 'react';
import {
	Modal,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BudgetItemWithAllocations } from '../api/list-budget-items';

type Props = {
	editingItem: BudgetItemWithAllocations | null;
	categories: Category[];
	payPeriods: PayPeriod[];
	onSubmit: (input: {
		categoryId: number;
		name: string;
		totalAmount: number;
		splitType: SplitType;
		customAllocations?: { payPeriodIndex: number; amount: number }[];
		dueDay: number | null;
	}) => void;
	onDelete?: () => void;
	onClose: () => void;
	isPending: boolean;
};

export const BudgetItemFormPage = ({
	editingItem,
	categories,
	payPeriods,
	onSubmit,
	onDelete,
	onClose,
	isPending,
}: Props) => {
	const colors = useThemeColors();
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [categoryId, setCategoryId] = useState<number | null>(null);
	const [customSplit, setCustomSplit] = useState(false);
	const [allocations, setAllocations] = useState<string[]>([]);
	const [focusedField, setFocusedField] = useState<string | null>(null);
	const [dueDay, setDueDay] = useState<number | null>(null);
	const [showDayPicker, setShowDayPicker] = useState(false);

	useEffect(() => {
		if (editingItem) {
			setName(editingItem.name);
			setAmount(String(editingItem.total_amount));
			setCategoryId(editingItem.category_id);
			setDueDay(editingItem.due_day);
			if (
				editingItem.split_type === 'custom' &&
				editingItem.allocations.length > 1
			) {
				setCustomSplit(true);
				setAllocations(editingItem.allocations.map((a) => String(a.amount)));
			} else {
				setCustomSplit(false);
				setAllocations([]);
			}
		} else {
			setName('');
			setAmount('');
			setCategoryId(categories[0]?.id ?? null);
			setCustomSplit(false);
			setAllocations([]);
			setDueDay(null);
		}
	}, [editingItem, categories]);

	const totalNum = Number(amount);
	const showSplitSection = payPeriods.length > 1;

	const allocationSum = allocations.reduce((s, a) => s + (Number(a) || 0), 0);
	const remaining = totalNum - allocationSum;
	const splitBalanced = !customSplit || Math.abs(remaining) < 0.01;

	const isValid =
		name.trim() !== '' && totalNum > 0 && categoryId !== null && splitBalanced;
	const canSubmit = isValid && !isPending;

	const submitLabel = isPending
		? 'Saving...'
		: editingItem
			? 'Save Changes'
			: 'Add Item';

	const onToggleCustomSplit = () => {
		if (!customSplit) {
			const even = totalNum / payPeriods.length;
			setAllocations(payPeriods.map(() => String(even)));
		}
		setCustomSplit((prev) => !prev);
	};

	const handleSubmit = () => {
		if (!isValid || categoryId === null) return;
		const splitType: SplitType =
			customSplit && payPeriods.length > 1 ? 'custom' : 'even';
		const customAllocations =
			splitType === 'custom'
				? payPeriods.map((p, i) => ({
						payPeriodIndex: p.index,
						amount: Number(allocations[i] ?? 0),
					}))
				: undefined;
		onSubmit({
			categoryId,
			name: name.trim(),
			totalAmount: totalNum,
			splitType,
			customAllocations,
			dueDay,
		});
	};

	return (
		<SafeAreaView
			edges={['top', 'bottom']}
			className="flex-1 bg-white dark:bg-zinc-900"
		>
			<ScrollView className="flex-1 px-6 pt-6">
				<View className="flex-row justify-between items-center mb-6">
					<Text className="text-xl font-bold text-slate-900 dark:text-slate-100">
						{editingItem ? 'Edit Item' : 'Add Item'}
					</Text>
					<Pressable onPress={onClose}>
						<Ionicons name="close" size={22} color={colors.muted} />
					</Pressable>
				</View>

				<Text className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
					Name
				</Text>
				<TextInput
					className={`bg-slate-50 dark:bg-zinc-900 rounded-xl px-4 py-3 text-base text-slate-900 dark:text-slate-100 mb-4 border ${focusedField === 'name' ? 'border-teal-600 dark:border-teal-500' : 'border-slate-200 dark:border-zinc-800'}`}
					placeholder="e.g., Rent"
					placeholderTextColor={colors.muted}
					value={name}
					onChangeText={setName}
					onFocus={() => setFocusedField('name')}
					onBlur={() => setFocusedField(null)}
				/>

				<Text className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
					Amount (monthly total)
				</Text>
				<TextInput
					className={`bg-slate-50 dark:bg-zinc-900 rounded-xl px-4 py-3 text-base text-slate-900 dark:text-slate-100 mb-4 border ${focusedField === 'amount' ? 'border-teal-600 dark:border-teal-500' : 'border-slate-200 dark:border-zinc-800'}`}
					placeholder="e.g., 3500"
					placeholderTextColor={colors.muted}
					value={amount}
					onChangeText={setAmount}
					keyboardType="numeric"
					onFocus={() => setFocusedField('amount')}
					onBlur={() => setFocusedField(null)}
				/>

				{showSplitSection && (
					<View className="mb-6">
						<View className="flex-row justify-between items-center mb-2">
							<Text className="text-sm font-medium text-slate-900 dark:text-slate-100">
								Split
							</Text>
							<Pressable onPress={onToggleCustomSplit} disabled={totalNum <= 0}>
								<Text
									className={`text-sm font-medium ${totalNum > 0 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-300 dark:text-slate-600'}`}
								>
									{customSplit ? 'Reset to even' : 'Customize'}
								</Text>
							</Pressable>
						</View>

						{customSplit ? (
							<>
								{payPeriods.map((period, i) => (
									<View
										key={period.index}
										className="flex-row items-center mb-2"
									>
										<Text
											className="text-sm text-slate-500 dark:text-slate-400 w-16"
											numberOfLines={1}
										>
											{period.label}
										</Text>
										<TextInput
											className={`flex-1 bg-slate-50 dark:bg-zinc-900 rounded-xl px-4 py-3 text-base text-slate-900 dark:text-slate-100 border ${focusedField === `alloc-${i}` ? 'border-teal-600 dark:border-teal-500' : 'border-slate-200 dark:border-zinc-800'}`}
											value={allocations[i] ?? ''}
											onChangeText={(val) => {
												const next = [...allocations];
												next[i] = val;
												setAllocations(next);
											}}
											keyboardType="numeric"
											onFocus={() => setFocusedField(`alloc-${i}`)}
											onBlur={() => setFocusedField(null)}
										/>
										<Pressable
											className="w-10 items-end"
											disabled={totalNum <= 0}
											onPress={() => {
												setAllocations(
													payPeriods.map((_, j) =>
														j === i ? String(totalNum) : '0',
													),
												);
											}}
										>
											<Text
												className={`text-sm font-medium ${totalNum > 0 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-300 dark:text-slate-600'}`}
											>
												Full
											</Text>
										</Pressable>
									</View>
								))}
								<Text
									className={`text-xs mt-1 ${splitBalanced ? 'text-teal-600 dark:text-teal-400' : 'text-red-500 dark:text-red-400'}`}
								>
									{splitBalanced
										? 'Split balanced'
										: `Remaining: ${remaining.toLocaleString()}`}
								</Text>
							</>
						) : (
							<Text className="text-sm text-slate-400 dark:text-slate-500">
								{totalNum > 0
									? `Split evenly · ${(totalNum / payPeriods.length).toLocaleString()} per period`
									: 'Split evenly across pay periods'}
							</Text>
						)}
					</View>
				)}

				<Text className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
					Category
				</Text>
				<View className="flex-row flex-wrap gap-2 mb-6">
					{categories.map((cat) => (
						<Pressable
							key={cat.id}
							className={`px-4 py-2 rounded-full ${
								categoryId === cat.id
									? 'bg-teal-600'
									: 'bg-slate-100 dark:bg-black'
							}`}
							onPress={() => setCategoryId(cat.id)}
						>
							<Text
								className={`text-sm ${
									categoryId === cat.id
										? 'text-white font-semibold'
										: 'text-slate-500 dark:text-slate-400'
								}`}
							>
								{cat.name}
							</Text>
						</Pressable>
					))}
				</View>

				{/* Due Date */}
				<Text className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
					Due date
				</Text>
				<Pressable
					className="bg-slate-50 dark:bg-zinc-900 rounded-xl px-4 py-3 mb-6 border border-slate-200 dark:border-zinc-800 flex-row justify-between items-center"
					onPress={() => setShowDayPicker(true)}
				>
					<Text
						className={`text-base ${dueDay ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}
					>
						{dueDay ? ordinal(dueDay) : 'None'}
					</Text>
					{dueDay !== null && (
						<Pressable
							hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
							onPress={() => setDueDay(null)}
						>
							<Ionicons name="close-circle" size={18} color={colors.muted} />
						</Pressable>
					)}
				</Pressable>

				{/* Day Picker Modal */}
				<Modal
					visible={showDayPicker}
					transparent
					animationType="fade"
					onRequestClose={() => setShowDayPicker(false)}
				>
					<Pressable
						className="flex-1 bg-black/40 justify-end"
						onPress={() => setShowDayPicker(false)}
					>
						<Pressable className="bg-white dark:bg-zinc-900 rounded-t-2xl pb-8">
							<View className="flex-row justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-zinc-800">
								<Text className="text-base font-bold text-slate-900 dark:text-slate-100">
									Select day
								</Text>
								<Pressable onPress={() => setShowDayPicker(false)}>
									<Ionicons name="close" size={20} color={colors.muted} />
								</Pressable>
							</View>
							<ScrollView style={{ maxHeight: 300 }} className="px-4 pt-2">
								{Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
									<Pressable
										key={day}
										className={`px-4 py-3 rounded-xl mb-1 ${dueDay === day ? 'bg-teal-600' : 'bg-slate-50 dark:bg-zinc-900'}`}
										onPress={() => {
											setDueDay(day);
											setShowDayPicker(false);
										}}
									>
										<Text
											className={`text-base ${dueDay === day ? 'text-white font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
										>
											{ordinal(day)}
										</Text>
									</Pressable>
								))}
							</ScrollView>
						</Pressable>
					</Pressable>
				</Modal>

				<Pressable
					className={`rounded-xl px-8 py-4 items-center mb-3 ${
						canSubmit ? 'bg-teal-600' : 'bg-slate-100 dark:bg-black'
					}`}
					onPress={handleSubmit}
					disabled={!canSubmit}
				>
					<Text
						className={`text-base font-bold ${canSubmit ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}
					>
						{submitLabel}
					</Text>
				</Pressable>

				{editingItem && onDelete && (
					<Pressable className="items-center py-3 mb-12" onPress={onDelete}>
						<Text className="text-red-500 dark:text-red-400 text-sm font-semibold">
							Delete Item
						</Text>
					</Pressable>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};
