import { clearAllData } from '@shared/db';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

export const useClearData = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const onClear = () => {
		Alert.alert(
			'Clear All Data',
			'This will permanently delete all your budget items, income sources, and preferences. This cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Clear',
					style: 'destructive',
					onPress: async () => {
						try {
							await clearAllData();
						} catch {
							Alert.alert('Error', 'Failed to clear data. Please try again.');
							return;
						}
						queryClient.clear();
						router.replace('/onboarding/welcome');
					},
				},
			],
		);
	};

	return { onClear };
};
