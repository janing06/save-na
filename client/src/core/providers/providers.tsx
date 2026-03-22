import { type ReactNode, Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';

type Props = {
	children: ReactNode;
};

export const Providers = ({ children }: Props) => {
	return (
		<Suspense
			fallback={
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" />
				</View>
			}
		>
			{children}
		</Suspense>
	);
}
