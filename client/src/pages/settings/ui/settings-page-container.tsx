import { useState } from 'react';
import {
	useCategories,
	useCreateCategory,
	useDeleteCategory,
	usePreferences,
	useUpdateCategory,
	useUpdateCurrency,
} from '../model/hooks';
import { SettingsPage } from './settings-page';

export function SettingsPageContainer() {
	const { preferences, refresh: refreshPrefs } = usePreferences();
	const { categories, refresh: refreshCats } = useCategories();
	const { onUpdate } = useUpdateCurrency(refreshPrefs);
	const createCat = useCreateCategory(refreshCats);
	const updateCat = useUpdateCategory(refreshCats);
	const deleteCat = useDeleteCategory(refreshCats);

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

	return (
		<SettingsPage
			preferences={preferences}
			categories={categories}
			currencyPicker={currencyPicker}
			createCategory={createCat}
			updateCategory={updateCat}
			deleteCategory={deleteCat}
		/>
	);
}
