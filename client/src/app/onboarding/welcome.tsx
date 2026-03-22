import { useRouter } from 'expo-router';
import { WelcomePage } from '@pages/onboarding';

const WelcomeScreen = () => {
	const router = useRouter();
	return <WelcomePage onNext={() => router.push('/onboarding/currency')} />;
};

export default WelcomeScreen;
