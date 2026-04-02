import { WelcomePage } from '@pages/onboarding';
import { useRouter } from 'expo-router';

const WelcomeScreen = () => {
	const router = useRouter();
	return <WelcomePage onNext={() => router.push('/onboarding/how-it-works')} />;
};

export default WelcomeScreen;
