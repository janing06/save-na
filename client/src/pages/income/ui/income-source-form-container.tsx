import { listIncomeSources } from '@shared/db';
import type { NotificationSettings, PaySchedule } from '@shared/lib';
import { queryKeys } from '@shared/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Modal, Platform } from 'react-native';
import { createIncomeSource } from '../api/create-income-source';
import { deleteIncomeSource } from '../api/delete-income-source';
import { updateIncomeSource } from '../api/update-income-source';
import { useNotificationConfig } from '../model/hooks';
import { IncomeSourceFormPage } from './income-source-form-page';

type Props = {
	visible: boolean;
	editingSourceId: number | null;
	onClose: () => void;
};

export const IncomeSourceFormContainer = ({
	visible,
	editingSourceId,
	onClose,
}: Props) => {
	const queryClient = useQueryClient();

	const { data: sources = [] } = useQuery({
		queryKey: queryKeys.incomeSources,
		queryFn: listIncomeSources,
	});
	const editingSource = editingSourceId
		? (sources.find((s) => s.id === editingSourceId) ?? null)
		: null;

	const { initialNotifications } = useNotificationConfig(
		editingSource?.id ?? null,
	);

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: queryKeys.incomeSources });
	};

	const createMutation = useMutation({
		mutationFn: createIncomeSource,
		onSuccess: () => {
			invalidate();
			onClose();
		},
		onError: () =>
			Alert.alert('Error', 'Failed to create income source. Please try again.'),
	});

	const updateMutation = useMutation({
		mutationFn: updateIncomeSource,
		onSuccess: () => {
			invalidate();
			if (editingSource) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.notificationConfigs(editingSource.id),
				});
			}
			onClose();
		},
		onError: () =>
			Alert.alert('Error', 'Failed to update income source. Please try again.'),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteIncomeSource,
		onSuccess: () => {
			invalidate();
			onClose();
		},
		onError: () =>
			Alert.alert('Error', 'Failed to delete income source. Please try again.'),
	});

	const onSubmit = (input: {
		name: string;
		amount: number;
		paySchedule: PaySchedule;
		payDates: number[];
		payAmounts?: number[];
		notifications: NotificationSettings;
	}) => {
		if (editingSource) {
			updateMutation.mutate({
				id: editingSource.id,
				...input,
			});
		} else {
			createMutation.mutate({ ...input });
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
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
			onRequestClose={onClose}
		>
			<IncomeSourceFormPage
				editingSource={editingSource}
				initialNotifications={initialNotifications}
				onSubmit={onSubmit}
				onDelete={onDelete}
				onClose={onClose}
				isPending={createMutation.isPending || updateMutation.isPending}
			/>
		</Modal>
	);
};
