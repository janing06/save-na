import { useState } from 'react';
import { useRouter } from 'expo-router';
import { atom, useAtom } from 'jotai';
import type { PaySchedule } from '@shared/lib';
import { completeOnboarding } from '../../api/complete-onboarding';
import { saveIncomeSource } from '../../api/save-income-source';

const onboardingCurrencyAtom = atom('PHP');

export const useOnboarding = () => {
	const router = useRouter();
	const [currency, setCurrency] = useAtom(onboardingCurrencyAtom);
	const [isPending, setIsPending] = useState(false);

	const onSelectCurrency = (code: string) => {
		setCurrency(code);
	};

	const onCurrencyNext = () => {
		router.push('/onboarding/income-source');
	};

	const onFinish = async (income: {
		name: string;
		amount: number;
		paySchedule: PaySchedule;
		payDates: number[];
	}) => {
		setIsPending(true);
		try {
			await completeOnboarding(currency);
			await saveIncomeSource(income);
			router.replace('/(tabs)/budget');
		} finally {
			setIsPending(false);
		}
	};

	return {
		currency,
		onSelectCurrency,
		onCurrencyNext,
		onFinish,
		isPending,
	};
}
