import { useRouter } from 'expo-router';
import { WelcomePage } from '@pages/onboarding';

export default function WelcomeScreen() {
	const router = useRouter();
	return <WelcomePage onNext={() => router.push('/onboarding/currency')} />;
}
