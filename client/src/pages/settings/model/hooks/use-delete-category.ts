import { useState } from 'react';
import { Alert } from 'react-native';
import { deleteCategory } from '../../api/delete-category';

export const useDeleteCategory = (onSuccess: () => void) => {
	const [isPending, setIsPending] = useState(false);

	const onDelete = (id: number) => {
		Alert.alert(
			'Delete Category',
			'Are you sure you want to delete this category?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						setIsPending(true);
						try {
							const result = await deleteCategory(id);
							if (result.blocked) {
								Alert.alert(
									'Cannot Delete',
									'This category has budget items. Remove them first.',
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
