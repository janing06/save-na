import { exportBackup, getDatabase, restoreBackup } from '@shared/db';
import type { Category } from '@shared/lib';
import { queryKeys } from '@shared/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import {
	useCategories,
	useClearData,
	usePreferences,
	useUpdateCurrency,
} from '../model/hooks';
import { SettingsPage } from './settings-page';

export const SettingsPageContainer = () => {
	const router = useRouter();
	const { preferences, isLoading: isPrefsLoading } = usePreferences();
	const { categories, isLoading: isCatsLoading } = useCategories();
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

	const [isBackingUp, setIsBackingUp] = useState(false);

	const handleExportBackup = async () => {
		setIsBackingUp(true);
		try {
			await exportBackup();
		} catch {
			Alert.alert(
				'Export Failed',
				'Something went wrong while exporting your data.',
			);
		} finally {
			setIsBackingUp(false);
		}
	};

	const handleRestoreBackup = () => {
		Alert.alert(
			'Restore Backup',
			'This will replace all your current data. Are you sure?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Restore',
					style: 'destructive',
					onPress: async () => {
						setIsBackingUp(true);
						try {
							const result = await restoreBackup();
							switch (result.status) {
								case 'success':
									// Invalidate all queries — restore replaces all data
									queryClient.invalidateQueries();
									Alert.alert(
										'Backup Restored',
										'Your data has been restored successfully.',
									);
									break;
								case 'invalid':
									Alert.alert(
										'Invalid Backup',
										'The selected file is not a valid SaveNa backup.',
									);
									break;
								case 'newer_version':
									Alert.alert(
										'Update Required',
										'This backup was created with a newer version of SaveNa. Please update the app first.',
									);
									break;
								case 'cancelled':
									break;
							}
						} catch {
							Alert.alert(
								'Restore Failed',
								'Something went wrong while restoring your data.',
							);
						} finally {
							setIsBackingUp(false);
						}
					},
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
			onExportBackup={handleExportBackup}
			onRestoreBackup={handleRestoreBackup}
			isLoading={isPrefsLoading || isCatsLoading || isBackingUp}
		/>
	);
};
