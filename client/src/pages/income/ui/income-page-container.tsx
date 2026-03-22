import { useEffect, useState } from 'react';
import { getPreferences } from '@shared/db';
import {
	useCreateIncomeSource,
	useDeleteIncomeSource,
	useIncomeSources,
	useUpdateIncomeSource,
} from '../model/hooks';
import { IncomePage } from './income-page';

export function IncomePageContainer() {
	const { sources, isLoading, refresh } = useIncomeSources();
	const create = useCreateIncomeSource(refresh);
	const update = useUpdateIncomeSource(refresh);
	const remove = useDeleteIncomeSource(() => { refresh(); update.onCancel(); });
	const [currency, setCurrency] = useState('PHP');

	useEffect(() => {
		async function loadCurrency() {
			const prefs = await getPreferences();
			if (prefs) setCurrency(prefs.currency);
		}
		loadCurrency();
	}, []);

	return (
		<IncomePage
			sources={sources}
			isLoading={isLoading}
			currency={currency}
			create={create}
			update={update}
			remove={remove}
		/>
	);
}
