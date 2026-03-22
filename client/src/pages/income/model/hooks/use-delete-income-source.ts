import { useState } from 'react';
import { Alert } from 'react-native';
import { deleteIncomeSource } from '../../api/delete-income-source';

export const useDeleteIncomeSource = (onSuccess: () => void) => {
	const [isPending, setIsPending] = useState(false);

	const onDelete = (id: number) => {
		Alert.alert(
			'Delete Income Source',
			'Are you sure you want to delete this income source?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						setIsPending(true);
						try {
							const result = await deleteIncomeSource(id);
							if (result.blocked) {
								Alert.alert(
									'Cannot Delete',
									'This income source has budget items. Remove or reassign them first.',
								);
							} else {
								onSuccess();
							}
						} finally {
							setIsPending(false);
						}
					},
				},
			],
		);
	};

	return { onDelete, isPending };
}
