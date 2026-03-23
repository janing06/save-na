import { useQuery } from '@tanstack/react-query';
import {
	useCreateIncomeSource,
	useDeleteIncomeSource,
	useIncomeSources,
	useUpdateIncomeSource,
} from '../model/hooks';
import { IncomePage } from './income-page';
import { queryKeys } from '@shared/lib';
import { getPreferences } from '@shared/db';

export const IncomePageContainer = () => {
	const { sources, isLoading } = useIncomeSources();
	const create = useCreateIncomeSource();
	const update = useUpdateIncomeSource();
	const remove = useDeleteIncomeSource(update.onCancel);

	const { data: prefs } = useQuery({
		queryKey: queryKeys.preferences,
		queryFn: getPreferences,
	});
	const currency = prefs?.currency ?? 'PHP';

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
};
