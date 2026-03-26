import { useState } from 'react';
import { useRouter } from 'expo-router';
import type { Category } from '@shared/lib';
import {
	useCategories,
	useClearData,
	useDeleteCategory,
	usePreferences,
	useUpdateCurrency,
} from '../model/hooks';
import { SettingsPage } from './settings-page';

export const SettingsPageContainer = () => {
	const router = useRouter();
	const { preferences } = usePreferences();
	const { categories } = useCategories();
	const { onUpdate } = useUpdateCurrency();
	const deleteCat = useDeleteCategory();
	const clearData = useClearData();

	const [currencyPickerVisible, setCurrencyPickerVisible] = useState(false);

	const currencyPicker = {
		visible: currencyPickerVisible,
		onShow: () => setCurrencyPickerVisible(true),
		onHide: () => setCurrencyPickerVisible(false),
		onUpdate: async (currency: string) => {
			await onUpdate(currency);
			setCurrencyPickerVisible(false);
		},
	};

	const categoryActions = {
		onAdd: () => router.push('/(tabs)/settings/category-form'),
		onEdit: (cat: Category) =>
			router.push({
				pathname: '/(tabs)/settings/category-form',
				params: { categoryId: String(cat.id) },
			}),
		onDelete: deleteCat.onDelete,
	};

	return (
		<SettingsPage
			preferences={preferences}
			categories={categories}
			currencyPicker={currencyPicker}
			categoryActions={categoryActions}
			onClearData={clearData.onClear}
		/>
	);
};
