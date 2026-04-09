import { Ionicons } from '@expo/vector-icons';
import type { Category } from '@shared/lib';
import { useThemeColors } from '@shared/lib';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
	editingCategory: Category | null;
	onSubmit: (name: string) => void;
	onDelete: () => void;
	onClose: () => void;
	isPending: boolean;
	isDeleting: boolean;
};

export const CategoryFormPage = ({
	editingCategory,
	onSubmit,
	onDelete,
	onClose,
	isPending,
	isDeleting,
}: Props) => {
	const colors = useThemeColors();
	const [name, setName] = useState('');
	const [nameFocused, setNameFocused] = useState(false);

	useEffect(() => {
		setName(editingCategory?.name ?? '');
	}, [editingCategory]);

	const isValid = name.trim() !== '';
	const isBusy = isPending || isDeleting;
	const showDelete =
		editingCategory !== null && editingCategory.is_default === 0;

	return (
		<SafeAreaView
			edges={['top']}
			className="flex-1 bg-white dark:bg-zinc-900 px-6 pt-6"
		>
			<View className="flex-row justify-between items-center mb-6">
				<Text className="text-xl font-bold text-slate-900 dark:text-slate-100">
					{editingCategory ? 'Rename Category' : 'Add Category'}
				</Text>
				<Pressable onPress={onClose}>
					<Ionicons name="close" size={22} color={colors.muted} />
				</Pressable>
			</View>

			<Text className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
				Name
			</Text>
			<TextInput
				className={`bg-slate-50 dark:bg-zinc-900 rounded-xl px-4 py-3 text-base text-slate-900 dark:text-slate-100 mb-6 border ${nameFocused ? 'border-teal-600 dark:border-teal-500' : 'border-slate-200 dark:border-zinc-800'}`}
				placeholder="e.g., Debt Repayment"
				placeholderTextColor={colors.muted}
				value={name}
				onChangeText={setName}
				onFocus={() => setNameFocused(true)}
				onBlur={() => setNameFocused(false)}
				autoFocus
			/>

			<Pressable
				className={`rounded-xl px-8 py-4 items-center mb-3 ${
					isValid && !isBusy ? 'bg-teal-600' : 'bg-slate-100 dark:bg-black'
				}`}
				onPress={() => onSubmit(name.trim())}
				disabled={!isValid || isBusy}
			>
				<Text
					className={`text-base font-bold ${isValid && !isBusy ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}
				>
					{isPending ? 'Saving...' : 'Save'}
				</Text>
			</Pressable>

			{showDelete && (
				<Pressable
					className="rounded-xl px-8 py-4 items-center"
					onPress={onDelete}
					disabled={isBusy}
				>
					<Text
						className={`text-base font-semibold ${isBusy ? 'text-slate-300 dark:text-slate-600' : 'text-red-500 dark:text-red-400'}`}
					>
						{isDeleting ? 'Deleting...' : 'Delete Category'}
					</Text>
				</Pressable>
			)}
		</SafeAreaView>
	);
};
