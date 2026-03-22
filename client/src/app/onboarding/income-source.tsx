import { IncomeSourcePage, useOnboarding } from '@pages/onboarding';

const IncomeSourceScreen = () => {
	const { onFinish, isPending } = useOnboarding();
	return <IncomeSourcePage onFinish={onFinish} isPending={isPending} />;
};

export default IncomeSourceScreen;
