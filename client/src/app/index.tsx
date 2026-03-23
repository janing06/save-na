import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { getPreferences } from '@shared/db';

const Index = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasOnboarded, setHasOnboarded] = useState(false);

	useEffect(() => {
		getPreferences().then((prefs) => {
			setHasOnboarded(!!prefs);
			setIsLoading(false);
		});
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
