import { CurrencyPage, useOnboarding } from '@pages/onboarding';

const CurrencyScreen = () => {
	const { currency, onSelectCurrency, onCurrencyNext } = useOnboarding();
	return (
		<CurrencyPage
			selectedCurrency={currency}
			onSelect={onSelectCurrency}
			onNext={onCurrencyNext}
		/>
	);
};

export default CurrencyScreen;
