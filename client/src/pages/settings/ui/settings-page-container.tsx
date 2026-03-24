import { useState } from 'react';
import {
	useCategories,
	useClearData,
	useCreateCategory,
	useDeleteCategory,
	usePreferences,
	useUpdateCategory,
	useUpdateCurrency,
} from '../model/hooks';
import { SettingsPage } from './settings-page';

export const SettingsPageContainer = () => {
	const { preferences } = usePreferences();
	const { categories } = useCategories();
	const { onUpdate } = useUpdateCurrency();
	const createCat = useCreateCategory();
	const updateCat = useUpdateCategory();
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

	return (
		<SettingsPage
			preferences={preferences}
			categories={categories}
			currencyPicker={currencyPicker}
			createCategory={createCat}
			updateCategory={updateCat}
			deleteCategory={deleteCat}
			onClearData={clearData.onClear}
		/>
	);
};
