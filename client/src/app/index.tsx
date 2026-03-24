import { getPreferences } from '@shared/db';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

const Index = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasOnboarded, setHasOnboarded] = useState(false);

	useEffect(() => {
		const check = async () => {
			try {
				const prefs = await getPreferences();
				setHasOnboarded(!!prefs);
			} catch {
				// DB failure — default to onboarding
			} finally {
				setIsLoading(false);
				await SplashScreen.hideAsync();
			}
		};
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
};

export default Index;
