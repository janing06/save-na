import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { getDatabase } from '@shared/db';

export default function Index() {
	const [isLoading, setIsLoading] = useState(true);
	const [hasOnboarded, setHasOnboarded] = useState(false);

	useEffect(() => {
		async function check() {
			const db = await getDatabase();
			const prefs = await db.getFirstAsync<{ id: number }>(
				'SELECT id FROM user_preferences WHERE id = 1',
			);
			setHasOnboarded(!!prefs);
			setIsLoading(false);
		}
		check();
	}, []);

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (hasOnboarded) {
		return <Redirect href="/(tabs)/budget" />;
	}

	return <Redirect href="/onboarding/welcome" />;
}
