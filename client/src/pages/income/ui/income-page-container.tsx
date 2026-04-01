import { getPreferences } from '@shared/db';
import type { IncomeSource } from '@shared/lib';
import { queryKeys } from '@shared/lib';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDeleteIncomeSource, useIncomeSources } from '../model/hooks';
import { IncomePage } from './income-page';
import { IncomeSourceFormContainer } from './income-source-form-container';

export const IncomePageContainer = () => {
	const { sources, isLoading } = useIncomeSources();
	const { onDelete } = useDeleteIncomeSource();

	const { data: prefs } = useQuery({
		queryKey: queryKeys.preferences,
		queryFn: getPreferences,
	});
	const currency = prefs?.currency ?? 'PHP';

	const [formVisible, setFormVisible] = useState(false);
	const [editingSourceId, setEditingSourceId] = useState<number | null>(null);

	const onAdd = () => {
		setEditingSourceId(null);
		setFormVisible(true);
	};

	const onEdit = (source: IncomeSource) => {
		setEditingSourceId(source.id);
		setFormVisible(true);
	};

	return (
		<>
			<IncomePage
				sources={sources}
				currency={currency}
				onAdd={onAdd}
				onEdit={onEdit}
				onDelete={onDelete}
				isLoading={isLoading}
			/>
			<IncomeSourceFormContainer
				visible={formVisible}
				editingSourceId={editingSourceId}
				onClose={() => setFormVisible(false)}
			/>
		</>
	);
};
