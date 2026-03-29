import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withTiming,
} from 'react-native-reanimated';

const Dot = ({ delay }: { delay: number }) => {
	const translateY = useSharedValue(0);

	useEffect(() => {
		translateY.value = withDelay(
			delay,
			withRepeat(
				withSequence(
					withTiming(-6, { duration: 300 }),
					withTiming(0, { duration: 300 }),
				),
				-1,
				false,
			),
		);
	}, [delay, translateY]);

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	return (
		<Animated.View
			style={animStyle}
			className="w-2 h-2 bg-teal-600 rounded-full"
		/>
	);
};

type Props = { visible: boolean };

export const LoadingOverlay = ({ visible }: Props) => {
	if (!visible) return null;

	return (
		<View className="absolute inset-0 bg-slate-100/80 items-center justify-center">
			<View
				className="bg-white rounded-2xl px-8 py-6 items-center shadow-sm"
				style={{ gap: 16 }}
			>
				<View className="flex-row items-center" style={{ gap: 8 }}>
					<Image
						// eslint-disable-next-line @typescript-eslint/no-require-imports
						source={require('../../../assets/images/icon.png')}
						style={{ width: 36, height: 36, borderRadius: 10 }}
					/>
					<Text className="text-lg font-bold text-teal-600">SaveNa</Text>
				</View>
				<View className="flex-row" style={{ gap: 6 }}>
					<Dot delay={0} />
					<Dot delay={150} />
					<Dot delay={300} />
				</View>
			</View>
		</View>
	);
};
