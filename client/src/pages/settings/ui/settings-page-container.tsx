import { useState } from 'react';
import { Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

	const queryClient = useQueryClient();

	const { mutate: removeApiKey } = useMutation({
		mutationFn: async () => {
			const db = await getDatabase();
			await db.runAsync(
				"UPDATE user_preferences SET openrouter_api_key = NULL, updated_at = datetime('now') WHERE id = 1",
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.apiKey });
		},
	});

	const handleRemoveApiKey = () => {
		Alert.alert(
			'Remove API Key',
			'This will remove your OpenRouter API key. You can re-enter it in the Chat tab.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Remove',
					style: 'destructive',
					onPress: () => removeApiKey(),
				},
			],
		);
	};

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
			onRemoveApiKey={handleRemoveApiKey}
		/>
	);
};
