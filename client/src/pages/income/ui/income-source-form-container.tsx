import { listIncomeSources } from '@shared/db';
import { queryKeys } from '@shared/lib';
import type { NotificationSettings, PaySchedule } from '@shared/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { createIncomeSource } from '../api/create-income-source';
import { deleteIncomeSource } from '../api/delete-income-source';
import { updateIncomeSource } from '../api/update-income-source';
import { IncomeSourceFormPage } from './income-source-form-page';

export const IncomeSourceFormContainer = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { sourceId } = useLocalSearchParams<{ sourceId?: string }>();

	const { data: sources = [] } = useQuery({
		queryKey: queryKeys.incomeSources,
		queryFn: listIncomeSources,
	});
	const editingSource = sourceId
		? (sources.find((s) => s.id === Number(sourceId)) ?? null)
		: null;

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: queryKeys.incomeSources });
	};

	const createMutation = useMutation({
		mutationFn: createIncomeSource,
		onSuccess: () => {
			invalidate();
			router.back();
		},
		onError: () =>
			Alert.alert('Error', 'Failed to create income source. Please try again.'),
	});

	const updateMutation = useMutation({
		mutationFn: updateIncomeSource,
		onSuccess: () => {
			invalidate();
			router.back();
		},
		onError: () =>
			Alert.alert('Error', 'Failed to update income source. Please try again.'),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteIncomeSource,
		onSuccess: () => {
			invalidate();
			router.back();
		},
		onError: () =>
			Alert.alert('Error', 'Failed to delete income source. Please try again.'),
	});

	const defaultNotifications: NotificationSettings = {
		paydayEnabled: false,
		paydayTime: '10:00',
		budgetReminderEnabled: false,
		budgetReminderTime: '10:00',
	};

	const onSubmit = (input: {
		name: string;
		amount: number;
		paySchedule: PaySchedule;
		payDates: number[];
		payAmounts?: number[];
	}) => {
		if (editingSource) {
			updateMutation.mutate({
				id: editingSource.id,
				...input,
				notifications: defaultNotifications,
			});
		} else {
			createMutation.mutate({ ...input, notifications: defaultNotifications });
		}
	};

	const onDelete = editingSource
		? () => {
				Alert.alert(
					'Delete Income Source',
					'This will permanently delete the income source and all its budget items across all months.',
					[
						{ text: 'Cancel', style: 'cancel' },
						{
							text: 'Delete',
							style: 'destructive',
							onPress: () => deleteMutation.mutate(editingSource.id),
						},
					],
				);
			}
		: undefined;

	return (
		<IncomeSourceFormPage
			editingSource={editingSource}
			onSubmit={onSubmit}
			onDelete={onDelete}
			onClose={() => router.back()}
			isPending={createMutation.isPending || updateMutation.isPending}
		/>
	);
};
