import { ActivityIndicator, View } from 'react-native';

type Props = { visible: boolean };

export const LoadingOverlay = ({ visible }: Props) => {
	if (!visible) return null;

	return (
		<View
			className="absolute inset-0 bg-black/30 items-center justify-center"
			pointerEvents="box-only"
		>
			<View className="bg-white rounded-3xl p-5">
				<ActivityIndicator size="small" color="#0d9488" />
			</View>
		</View>
	);
};
