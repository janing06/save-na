import { getDatabase } from '@shared/db';
import { queryKeys } from '@shared/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useColorScheme } from 'nativewind';

type ThemeValue = 'system' | 'light' | 'dark';

export const useTheme = () => {
	const { setColorScheme } = useColorScheme();
	const queryClient = useQueryClient();

	const { data: theme = 'light' } = useQuery({
		queryKey: queryKeys.theme,
		queryFn: async (): Promise<ThemeValue> => {
			const db = await getDatabase();
			const row = await db.getFirstAsync<{ theme: string | null }>(
				'SELECT theme FROM user_preferences WHERE id = 1',
			);
			return (row?.theme as ThemeValue) ?? 'light';
		},
	});

	const { mutate: updateTheme } = useMutation({
		mutationFn: async (newTheme: ThemeValue) => {
			const db = await getDatabase();
			await db.runAsync(
				"UPDATE user_preferences SET theme = ?, updated_at = datetime('now') WHERE id = 1",
				[newTheme],
			);
		},
		onSuccess: (_data, newTheme) => {
			queryClient.setQueryData(queryKeys.theme, newTheme);
			setColorScheme(newTheme);
		},
	});

	return { theme: theme as ThemeValue, updateTheme };
};
