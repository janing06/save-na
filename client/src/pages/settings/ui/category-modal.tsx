import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Category } from '@shared/lib';

type Props = {
	visible: boolean;
	editingCategory: Category | null;
	onSubmit: (name: string) => void;
	onClose: () => void;
	isPending: boolean;
};

export const CategoryModal = ({
	visible,
	editingCategory,
	onSubmit,
	onClose,
	isPending,
}: Props) => {
	const [name, setName] = useState('');
	const [nameFocused, setNameFocused] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: visible is a prop that triggers form reset when the modal opens
	useEffect(() => {
		setName(editingCategory?.name ?? '');
	}, [editingCategory, visible]);

	const isValid = name.trim() !== '';

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="pageSheet"
		>
			<View className="flex-1 bg-white pt-6 px-6">
				<View className="flex-row justify-between items-center mb-6">
					<Text className="text-xl font-bold text-slate-900">
						{editingCategory ? 'Rename Category' : 'Add Category'}
					</Text>
					<Pressable onPress={onClose}>
						<Ionicons name="close" size={22} color="#94a3b8" />
					</Pressable>
				</View>

				<Text className="text-sm font-medium text-slate-700 mb-1">Name</Text>
				<TextInput
					className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 mb-6 border ${nameFocused ? 'border-teal-600' : 'border-slate-200'}`}
					placeholder="e.g., Debt Repayment"
					placeholderTextColor="#94a3b8"
					value={name}
					onChangeText={setName}
					onFocus={() => setNameFocused(true)}
					onBlur={() => setNameFocused(false)}
					autoFocus
				/>

				<Pressable
					className={`rounded-xl px-8 py-4 items-center ${
						isValid && !isPending ? 'bg-teal-600' : 'bg-slate-200'
					}`}
					onPress={() => isValid && onSubmit(name.trim())}
					disabled={!isValid || isPending}
				>
					<Text className={`text-base font-bold ${isValid && !isPending ? 'text-white' : 'text-slate-400'}`}>
						{isPending ? 'Saving...' : 'Save'}
					</Text>
				</Pressable>
			</View>
		</Modal>
	);
}
