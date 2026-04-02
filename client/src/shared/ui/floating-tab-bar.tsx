import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { usePathname } from 'expo-router';
import { type ReactNode, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';

// Bar height (60) + bottom offset above safe area (12) + gap (8)
export const TAB_BAR_CLEARANCE = 80;

const TAB_ICONS: Record<string, (color: string) => ReactNode> = {
	budget: (color) => (
		<FontAwesome6 name="chart-simple" size={20} color={color} />
	),
	income: (color) => <Entypo name="wallet" size={20} color={color} />,
	settings: (color) => (
		<Ionicons name="settings-sharp" size={20} color={color} />
	),
};

const TAB_LABELS: Record<string, string> = {
	budget: 'Budget',
	income: 'Income',
	settings: 'Settings',
};

type TabItemProps = {
	name: string;
	isFocused: boolean;
	onPress: () => void;
};

const TabItem = ({ name, isFocused, onPress }: TabItemProps) => {
	const width = useSharedValue(isFocused ? 110 : 44);
	const labelOpacity = useSharedValue(isFocused ? 1 : 0);

	useEffect(() => {
		width.value = withSpring(isFocused ? 110 : 44, {
			damping: 20,
			stiffness: 200,
		});
		labelOpacity.value = withTiming(isFocused ? 1 : 0, { duration: 150 });
	}, [isFocused, width, labelOpacity]);

	const pillStyle = useAnimatedStyle(() => ({
		width: width.value,
	}));

	const labelStyle = useAnimatedStyle(() => ({
		opacity: labelOpacity.value,
	}));

	const iconColor = isFocused ? '#0d9488' : 'rgba(255,255,255,0.65)';

	return (
		<Pressable onPress={onPress} className="items-center justify-center">
			<Animated.View
				style={pillStyle}
				className={`h-9 flex-row items-center justify-center gap-1.5 rounded-full overflow-hidden ${
					isFocused ? 'bg-white' : ''
				}`}
			>
				{TAB_ICONS[name]?.(iconColor)}
				<Animated.Text
					style={labelStyle}
					className="text-sm font-semibold text-teal-600"
					numberOfLines={1}
					pointerEvents={isFocused ? 'auto' : 'none'}
				>
					{TAB_LABELS[name]}
				</Animated.Text>
			</Animated.View>
		</Pressable>
	);
};

export const FloatingTabBar = ({
	state,
	navigation,
	insets,
}: BottomTabBarProps) => {
	const pathname = usePathname();

	if (pathname.startsWith('/budget/chat')) return null;

	const visibleRoutes = state.routes.filter((r) => r.name !== 'chat');

	return (
		<View
			className="absolute left-0 right-0 items-center"
			style={{ bottom: insets.bottom + 12 }}
			pointerEvents="box-none"
		>
			<View
				className="flex-row items-center bg-teal-600 rounded-full px-3 gap-1"
				style={{
					height: 50,
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.18,
					shadowRadius: 8,
					elevation: 8,
				}}
			>
				{visibleRoutes.map((route) => {
					const index = state.routes.indexOf(route);
					const isFocused = state.index === index;

					return (
						<TabItem
							key={route.key}
							name={route.name}
							isFocused={isFocused}
							onPress={() => {
								if (!isFocused) {
									navigation.navigate(route.name);
								}
							}}
						/>
					);
				})}
			</View>
		</View>
	);
};
