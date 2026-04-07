import { exportBackup, restoreBackup } from '@shared/db';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useBackup = () => {
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(false);

	const onExport = async () => {
		setIsLoading(true);
		try {
			await exportBackup();
		} catch {
			Alert.alert(
				'Export Failed',
				'Something went wrong while exporting your data.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	const onRestore = () => {
		Alert.alert(
			'Restore Backup',
			'This will replace all your current data. Are you sure?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Restore',
					style: 'destructive',
					onPress: async () => {
						setIsLoading(true);
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
							setIsLoading(false);
						}
					},
				},
			],
		);
	};

	return { onExport, onRestore, isLoading };
};
