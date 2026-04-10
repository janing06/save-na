import { getModelById } from '@shared/config';
import { getDatabase } from '@shared/db';
import type { Category } from '@shared/lib';
import { queryKeys } from '@shared/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Directory, File, Paths } from 'expo-file-system';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import {
	useBackup,
	useCategories,
	useClearData,
	usePreferences,
	useTheme,
	useUpdateCurrency,
} from '../model/hooks';
import { SettingsPage } from './settings-page';

export const SettingsPageContainer = () => {
	const router = useRouter();
	const { preferences, isLoading: isPrefsLoading } = usePreferences();
	const { categories, isLoading: isCatsLoading } = useCategories();
	const { onUpdate } = useUpdateCurrency();
	const clearData = useClearData();
	const backup = useBackup();
	const { theme, updateTheme } = useTheme();

	const { data: selectedModelId = null } = useQuery({
		queryKey: queryKeys.selectedModel,
		queryFn: async () => {
			const db = await getDatabase();
			const row = await db.getFirstAsync<{ selected_model: string | null }>(
				'SELECT selected_model FROM user_preferences WHERE id = 1',
			);
			return row?.selected_model ?? null;
		},
	});

	const model = selectedModelId ? getModelById(selectedModelId) : null;

	const queryClient = useQueryClient();

	const { mutate: deleteModelMutation } = useMutation({
		mutationFn: async () => {
			if (!model) return;
			const file = new File(
				new Directory(Paths.document, 'models'),
				model.fileName,
			);
			if (file.exists) {
				file.delete();
			}
			const db = await getDatabase();
			await db.runAsync(
				"UPDATE user_preferences SET selected_model = NULL, updated_at = datetime('now') WHERE id = 1",
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.selectedModel });
		},
	});

	const handleDeleteModel = () => {
		Alert.alert(
			'Delete Model',
			`This will delete the ${model?.label ?? ''} model file to free up storage. You can download it again in the Chat tab.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => deleteModelMutation(),
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
			modelName={model?.label ?? null}
			modelSize={model?.sizeLabel ?? null}
			onDeleteModel={handleDeleteModel}
			onExportBackup={backup.onExport}
			onRestoreBackup={backup.onRestore}
			isLoading={isPrefsLoading || isCatsLoading || backup.isLoading}
			theme={theme}
			onThemeChange={updateTheme}
		/>
	);
};
