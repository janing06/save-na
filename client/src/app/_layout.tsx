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
import { AppLockOverlay } from '@shared/ui';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
	const [fontsLoaded] = useFonts({
		PlusJakartaSans_400Regular,
		PlusJakartaSans_500Medium,
		PlusJakartaSans_600SemiBold,
		PlusJakartaSans_700Bold,
	});

	const [appLockReady, setAppLockReady] = useState(false);

	const handleAppLockReady = useCallback(() => {
		setAppLockReady(true);
	}, []);

	useEffect(() => {
		requestNotificationPermission()
			.then((granted) => {
				if (granted) rescheduleAllNotifications().catch(() => {});
			})
			.catch(() => {});
	}, []);

	useEffect(() => {
		if (fontsLoaded && appLockReady) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, appLockReady]);

	if (!fontsLoaded) return null;

	return (
		<Providers>
			<Slot />
			<AppLockOverlay onReady={handleAppLockReady} />
		</Providers>
	);
};

export default RootLayout;
