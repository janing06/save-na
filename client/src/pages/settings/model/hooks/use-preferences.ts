import { useCallback, useEffect, useState } from 'react';
import type { UserPreferences } from '@shared/lib';
import { getPreferences } from '../../api/get-preferences';

export const usePreferences = () => {
	const [preferences, setPreferences] = useState<UserPreferences | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const refresh = useCallback(async () => {
		setIsLoading(true);
		const prefs = await getPreferences();
		setPreferences(prefs);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	return { preferences, isLoading, refresh };
}
