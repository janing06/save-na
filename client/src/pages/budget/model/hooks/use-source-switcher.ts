import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import type { IncomeSource } from '@shared/lib';
import { listIncomeSources } from '@shared/db';

export function useSourceSwitcher() {
	const [sources, setSources] = useState<IncomeSource[]>([]);
	const [selectedSourceId, setSelectedSourceId] = useState<
		number | 'total' | null
	>(null);
	const hasInitialized = useRef(false);

	const refresh = useCallback(async () => {
		const data = await listIncomeSources();
		setSources(data);
		if (!hasInitialized.current && data.length > 0) {
			setSelectedSourceId(data[0].id);
			hasInitialized.current = true;
		}
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
		refresh,
	};
}
