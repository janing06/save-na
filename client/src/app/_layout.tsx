import '../../global.css';
import { Providers } from '@core/providers/providers';
import {
	PlusJakartaSans_400Regular,
	PlusJakartaSans_500Medium,
	PlusJakartaSans_600SemiBold,
	PlusJakartaSans_700Bold,
	useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { getDatabase } from '@shared/db';
import {
	requestNotificationPermission,
	rescheduleAllNotifications,
} from '@shared/lib';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
	const [fontsLoaded] = useFonts({
		PlusJakartaSans_400Regular,
		PlusJakartaSans_500Medium,
		PlusJakartaSans_600SemiBold,
		PlusJakartaSans_700Bold,
	});

	const { setColorScheme } = useColorScheme();
	const [themeReady, setThemeReady] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const db = await getDatabase();
				const row = await db.getFirstAsync<{ theme: string | null }>(
					'SELECT theme FROM user_preferences WHERE id = 1',
				);
				const theme = row?.theme ?? 'light';
				setColorScheme(theme as 'system' | 'light' | 'dark');
			} catch {
				setColorScheme('light');
			}
			setThemeReady(true);
		})();
	}, [setColorScheme]);

	useEffect(() => {
		requestNotificationPermission()
			.then((granted) => {
				if (granted) rescheduleAllNotifications().catch(() => {});
			})
			.catch(() => {});
	}, []);

	useEffect(() => {
		if (fontsLoaded && themeReady) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, themeReady]);

	if (!fontsLoaded || !themeReady) return null;

	return (
		<Providers>
			<Slot />
		</Providers>
	);
};

export default RootLayout;
