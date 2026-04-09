import { useThemeColors } from '@shared/lib';
import { ActivityIndicator, View } from 'react-native';

type Props = { visible: boolean };

export const LoadingOverlay = ({ visible }: Props) => {
	const colors = useThemeColors();

	if (!visible) return null;

	return (
		<View
			className="absolute inset-0 bg-black/30 items-center justify-center"
			pointerEvents="box-only"
		>
			<View className="bg-white dark:bg-zinc-900 rounded-3xl p-5">
				<ActivityIndicator size="small" color={colors.brand} />
			</View>
		</View>
	);
};
