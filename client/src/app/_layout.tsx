import '../../global.css';
import { Slot } from 'expo-router';
import { Providers } from '@core/providers/providers';

export default function RootLayout() {
	return (
		<Providers>
			<Slot />
		</Providers>
	);
}
