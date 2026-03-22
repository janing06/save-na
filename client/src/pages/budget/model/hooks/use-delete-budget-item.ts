import { useState } from 'react';
import { Alert } from 'react-native';
import { deleteBudgetItem } from '../../api/delete-budget-item';

export const useDeleteBudgetItem = (onSuccess: () => void) => {
	const [isPending, setIsPending] = useState(false);

	const onDelete = (id: number) => {
		Alert.alert(
			'Delete Item',
			'Are you sure you want to delete this budget item?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						setIsPending(true);
						try {
							await deleteBudgetItem(id);
							onSuccess();
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
