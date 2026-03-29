import { getPreferences } from '@shared/db';
import type { IncomeSource } from '@shared/lib';
import { queryKeys } from '@shared/lib';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useDeleteIncomeSource, useIncomeSources } from '../model/hooks';
import { IncomePage } from './income-page';

export const IncomePageContainer = () => {
	const router = useRouter();
	const { sources, isLoading } = useIncomeSources();
	const { onDelete } = useDeleteIncomeSource();

	const { data: prefs } = useQuery({
		queryKey: queryKeys.preferences,
		queryFn: getPreferences,
	});
	const currency = prefs?.currency ?? 'PHP';

	const onAdd = () => router.push('/(tabs)/income/income-source-form');

	const onEdit = (source: IncomeSource) =>
		router.push({
			pathname: '/(tabs)/income/income-source-form',
			params: { sourceId: String(source.id) },
		});

	return (
		<IncomePage
			sources={sources}
			currency={currency}
			onAdd={onAdd}
			onEdit={onEdit}
			onDelete={onDelete}
			isLoading={isLoading}
		/>
	);
};
