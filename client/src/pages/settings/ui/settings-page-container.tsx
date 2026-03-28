import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { getDatabase } from '@shared/db';
import type { Category } from '@shared/lib';
import { queryKeys } from '@shared/lib';
import {
	useCategories,
	useClearData,
	usePreferences,
	useUpdateCurrency,
} from '../model/hooks';
import { SettingsPage } from './settings-page';

export const SettingsPageContainer = () => {
	const router = useRouter();
	const { preferences } = usePreferences();
	const { categories } = useCategories();
	const { onUpdate } = useUpdateCurrency();
	const clearData = useClearData();

	const { data: apiKey = null } = useQuery({
		queryKey: queryKeys.apiKey,
		queryFn: async () => {
			const db = await getDatabase();
			const row = await db.getFirstAsync<{ openrouter_api_key: string | null }>(
				'SELECT openrouter_api_key FROM user_preferences WHERE id = 1',
			);
			return row?.openrouter_api_key ?? null;
		},
	});

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
	};

	return (
		<SettingsPage
			preferences={preferences}
			categories={categories}
			currencyPicker={currencyPicker}
			categoryActions={categoryActions}
			onClearData={clearData.onClear}
			apiKey={apiKey}
		/>
	);
};
