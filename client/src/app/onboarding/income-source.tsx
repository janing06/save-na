import { IncomeSourcePage, useOnboarding } from '@pages/onboarding';

export default function IncomeSourceScreen() {
	const { onFinish, isPending } = useOnboarding();
	return <IncomeSourcePage onFinish={onFinish} isPending={isPending} />;
}
