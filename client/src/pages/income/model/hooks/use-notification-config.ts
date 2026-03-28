import { getNotificationConfigsForSource } from '@shared/db';
import type { NotificationConfig } from '@shared/lib';
import { queryKeys } from '@shared/lib';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useNotificationConfig = (incomeSourceId: number | null) => {
	const { data } = useQuery({
		queryKey: queryKeys.notificationConfigs(incomeSourceId ?? 0),
		queryFn: () => getNotificationConfigsForSource(incomeSourceId!),
		enabled: incomeSourceId !== null,
	});

	const configs: NotificationConfig[] = data ?? [];

	const paydayConfig = configs.find((c) => c.type === 'payday');
	const reminderConfig = configs.find((c) => c.type === 'budget_reminder');

	return useMemo(
		() => ({
			initialNotifications: {
				paydayEnabled: (paydayConfig?.enabled ?? 1) === 1,
				paydayTime: paydayConfig?.time ?? '10:00',
				budgetReminderEnabled: (reminderConfig?.enabled ?? 1) === 1,
				budgetReminderTime: reminderConfig?.time ?? '10:00',
			},
		}),
		[paydayConfig, reminderConfig],
	);
};
