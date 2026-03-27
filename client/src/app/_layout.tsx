import '../../global.css';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Providers } from '@core/providers/providers';
import { rescheduleAllNotifications } from '@shared/lib';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
	useEffect(() => {
		rescheduleAllNotifications().catch(() => {});
	}, []);

	return (
		<Providers>
			<Slot />
		</Providers>
	);
};

export default RootLayout;
