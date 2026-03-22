import { CurrencyPage, useOnboarding } from '@pages/onboarding';

export default function CurrencyScreen() {
	const { currency, onSelectCurrency, onCurrencyNext } = useOnboarding();
	return (
		<CurrencyPage
			selectedCurrency={currency}
			onSelect={onSelectCurrency}
			onNext={onCurrencyNext}
		/>
	);
}
