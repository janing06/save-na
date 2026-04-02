import { HowItWorksPage } from '@pages/onboarding';
import { useRouter } from 'expo-router';

const HowItWorksScreen = () => {
	const router = useRouter();
	return <HowItWorksPage onNext={() => router.push('/onboarding/currency')} />;
};

export default HowItWorksScreen;
