import '../../global.css';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Providers } from '@core/providers/providers';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
	return (
		<Providers>
			<Slot />
		</Providers>
	);
};

export default RootLayout;
