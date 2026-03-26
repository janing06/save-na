import { Ionicons } from '@expo/vector-icons';
import type { Category } from '@shared/lib';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
	editingCategory: Category | null;
	onSubmit: (name: string) => void;
	onClose: () => void;
	isPending: boolean;
};

export const CategoryFormPage = ({
	editingCategory,
	onSubmit,
	onClose,
	isPending,
}: Props) => {
	const [name, setName] = useState('');
	const [nameFocused, setNameFocused] = useState(false);

	useEffect(() => {
		setName(editingCategory?.name ?? '');
	}, [editingCategory]);

	const isValid = name.trim() !== '';

	return (
		<SafeAreaView edges={['top']} className="flex-1 bg-white px-6 pt-6">
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
				onPress={() => onSubmit(name.trim())}
				disabled={!isValid || isPending}
			>
				<Text
					className={`text-base font-bold ${isValid && !isPending ? 'text-white' : 'text-slate-400'}`}
				>
					{isPending ? 'Saving...' : 'Save'}
				</Text>
			</Pressable>
		</SafeAreaView>
	);
};
