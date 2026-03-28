import '../../global.css';
import { Providers } from '@core/providers/providers';
import {
	requestNotificationPermission,
	rescheduleAllNotifications,
} from '@shared/lib';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
	useEffect(() => {
		requestNotificationPermission()
			.then((granted) => {
				if (granted) rescheduleAllNotifications().catch(() => {});
			})
			.catch(() => {});
	}, []);

	return (
		<Providers>
			<Slot />
		</Providers>
	);
};

export default RootLayout;
