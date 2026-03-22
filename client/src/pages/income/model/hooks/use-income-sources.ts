import { useCallback, useEffect, useState } from 'react';
import type { IncomeSource } from '@shared/lib';
import { listIncomeSources } from '../../api/list-income-sources';

export function useIncomeSources() {
	const [sources, setSources] = useState<IncomeSource[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const refresh = useCallback(async () => {
		setIsLoading(true);
		const data = await listIncomeSources();
		setSources(data);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	return { sources, isLoading, refresh };
}
