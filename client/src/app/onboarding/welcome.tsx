import { WelcomePage } from '@pages/onboarding';
import { useRouter } from 'expo-router';

const WelcomeScreen = () => {
	const router = useRouter();
	return <WelcomePage onNext={() => router.push('/onboarding/currency')} />;
};

export default WelcomeScreen;
