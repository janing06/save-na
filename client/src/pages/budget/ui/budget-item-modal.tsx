import { Ionicons } from '@expo/vector-icons';
import type { Category, SplitType } from '@shared/lib';
import { useEffect, useState } from 'react';
import {
	Modal,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native';
import type { BudgetItemWithAllocations } from '../api/list-budget-items';

type Props = {
	visible: boolean;
	editingItem: BudgetItemWithAllocations | null;
	categories: Category[];
	onSubmit: (input: {
		categoryId: number;
		name: string;
		totalAmount: number;
		splitType: SplitType;
	}) => void;
	onDelete?: (id: number) => void;
	onClose: () => void;
	isPending: boolean;
};

export const BudgetItemModal = ({
	visible,
	editingItem,
	categories,
	onSubmit,
	onDelete,
	onClose,
	isPending,
}: Props) => {
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [categoryId, setCategoryId] = useState<number | null>(null);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: visible is a prop that triggers form reset when the modal opens
	useEffect(() => {
		if (editingItem) {
			setName(editingItem.name);
			setAmount(String(editingItem.total_amount));
			setCategoryId(editingItem.category_id);
		} else {
			setName('');
			setAmount('');
			setCategoryId(categories[0]?.id ?? null);
		}
	}, [editingItem, visible, categories]);

	const isValid =
		name.trim() !== '' && Number(amount) > 0 && categoryId !== null;

	const canSubmit = isValid && !isPending;
	const submitLabel = isPending
		? 'Saving...'
		: editingItem
			? 'Save Changes'
			: 'Add Item';

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="pageSheet"
		>
			<ScrollView className="flex-1 bg-white pt-6 px-6">
				<View className="flex-row justify-between items-center mb-6">
					<Text className="text-xl font-bold text-slate-900">
						{editingItem ? 'Edit Item' : 'Add Item'}
					</Text>
					<Pressable onPress={onClose}>
						<Ionicons name="close" size={22} color="#94a3b8" />
					</Pressable>
				</View>

				<Text className="text-sm font-medium text-slate-700 mb-1">Name</Text>
				<TextInput
					className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 mb-4 border ${focusedField === 'name' ? 'border-teal-600' : 'border-slate-200'}`}
					placeholder="e.g., Rent"
					placeholderTextColor="#94a3b8"
					value={name}
					onChangeText={setName}
					onFocus={() => setFocusedField('name')}
					onBlur={() => setFocusedField(null)}
				/>

				<Text className="text-sm font-medium text-slate-700 mb-1">
					Amount (monthly total)
				</Text>
				<TextInput
					className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 mb-4 border ${focusedField === 'amount' ? 'border-teal-600' : 'border-slate-200'}`}
					placeholder="e.g., 6800"
					placeholderTextColor="#94a3b8"
					value={amount}
					onChangeText={setAmount}
					keyboardType="numeric"
					onFocus={() => setFocusedField('amount')}
					onBlur={() => setFocusedField(null)}
				/>

				<Text className="text-sm font-medium text-slate-700 mb-2">
					Category
				</Text>
				<View className="flex-row flex-wrap gap-2 mb-6">
					{categories.map((cat) => (
						<Pressable
							key={cat.id}
							className={`px-4 py-2 rounded-full ${
								categoryId === cat.id ? 'bg-teal-600' : 'bg-slate-100'
							}`}
							onPress={() => setCategoryId(cat.id)}
						>
							<Text
								className={`text-sm ${
									categoryId === cat.id
										? 'text-white font-semibold'
										: 'text-slate-600'
								}`}
							>
								{cat.name}
							</Text>
						</Pressable>
					))}
				</View>

				<Pressable
					className={`rounded-xl px-8 py-4 items-center mb-3 ${
						canSubmit ? 'bg-teal-600' : 'bg-slate-200'
					}`}
					onPress={() =>
						isValid &&
						onSubmit({
							categoryId: categoryId!,
							name: name.trim(),
							totalAmount: Number(amount),
							splitType: 'even',
						})
					}
					disabled={!canSubmit}
				>
					<Text
						className={`text-base font-bold ${canSubmit ? 'text-white' : 'text-slate-400'}`}
					>
						{submitLabel}
					</Text>
				</Pressable>

				{editingItem && onDelete && (
					<Pressable
						className="items-center py-3 mb-12"
						onPress={() => onDelete(editingItem.id)}
					>
						<Text className="text-red-500 text-sm font-semibold">
							Delete Item
						</Text>
					</Pressable>
				)}
			</ScrollView>
		</Modal>
	);
};
