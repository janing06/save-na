import { listIncomeSources } from '@shared/db';
import type { IncomeSource } from '@shared/lib';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export const useSourceSwitcher = () => {
	const [sources, setSources] = useState<IncomeSource[]>([]);
	const [selectedSourceId, setSelectedSourceId] = useState<
		number | 'total' | null
	>(null);

	const refresh = useCallback(async () => {
		const data = await listIncomeSources();
		setSources(data);
		setSelectedSourceId((current) => {
			if (data.length === 0) return null;
			const isValid =
				current === 'total' ||
				(typeof current === 'number' && data.some((s) => s.id === current));
			return isValid ? current : data[0].id;
		});
	}, []);

	useFocusEffect(
		useCallback(() => {
			refresh();
		}, [refresh]),
	);

	const showSwitcher = sources.length > 1;
	const selectedSource =
		typeof selectedSourceId === 'number'
			? (sources.find((s) => s.id === selectedSourceId) ?? null)
			: null;

	const onSelect = (id: number | 'total') => setSelectedSourceId(id);

	return {
		sources,
		selectedSourceId,
		selectedSource,
		showSwitcher,
		onSelect,
	};
}
