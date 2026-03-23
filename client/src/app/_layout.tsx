import '../../global.css';
import { Slot } from 'expo-router';
import { Providers } from '@core/providers/providers';

const RootLayout = () => {
	return (
		<Providers>
			<Slot />
		</Providers>
	);
};

export default RootLayout;
