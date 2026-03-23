import { type ReactNode, Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

type Props = {
	children: ReactNode;
};

export const Providers = ({ children }: Props) => {
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
