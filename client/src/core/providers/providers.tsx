import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, Suspense, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

type Props = {
	children: ReactNode;
};

export const Providers = ({ children }: Props) => {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<Suspense
				fallback={
					<View className="flex-1 items-center justify-center">
						<ActivityIndicator size="large" />
					</View>
				}
			>
				{children}
			</Suspense>
		</QueryClientProvider>
	);
};
