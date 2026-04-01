import '../../global.css';
import { Providers } from '@core/providers/providers';
import {
	PlusJakartaSans_400Regular,
	PlusJakartaSans_500Medium,
	PlusJakartaSans_600SemiBold,
	PlusJakartaSans_700Bold,
	useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
	requestNotificationPermission,
	rescheduleAllNotifications,
} from '@shared/lib';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
	const [fontsLoaded] = useFonts({
		PlusJakartaSans_400Regular,
		PlusJakartaSans_500Medium,
		PlusJakartaSans_600SemiBold,
		PlusJakartaSans_700Bold,
	});

	useEffect(() => {
		requestNotificationPermission()
			.then((granted) => {
				if (granted) rescheduleAllNotifications().catch(() => {});
			})
			.catch(() => {});
	}, []);

	if (!fontsLoaded) return null;

	return (
		<Providers>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="chat" options={{ animation: 'slide_from_right' }} />
			</Stack>
		</Providers>
	);
};

export default RootLayout;
