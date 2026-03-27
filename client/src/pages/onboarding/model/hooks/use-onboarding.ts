import type { PaySchedule } from '@shared/lib';
import {
	requestNotificationPermission,
	rescheduleAllNotifications,
} from '@shared/lib';
import { useRouter } from 'expo-router';
import { atom, useAtom } from 'jotai';
import { useState } from 'react';
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
		payAmounts?: number[];
	}) => {
		setIsPending(true);
		try {
			await completeOnboarding(currency);
			await saveIncomeSource(income);
			router.replace('/(tabs)/budget');
			requestNotificationPermission()
				.then((granted) => {
					if (granted) rescheduleAllNotifications().catch(() => {});
				})
				.catch(() => {});
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
};
