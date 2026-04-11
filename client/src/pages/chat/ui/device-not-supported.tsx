import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@shared/lib';
import { useColorScheme } from 'nativewind';
import { Pressable, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
	onClose: () => void;
};

export const DeviceNotSupported = ({ onClose }: Props) => {
	const colors = useThemeColors();
	const { colorScheme } = useColorScheme();

	return (
		<SafeAreaView
			edges={['top', 'bottom']}
			className="flex-1 bg-white dark:bg-black"
		>
			<StatusBar
				barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
			/>
			<View className="px-5 py-4 flex-row items-center">
				<Pressable onPress={onClose} className="active:opacity-60">
					<Ionicons name="arrow-back" size={24} color={colors.text} />
				</Pressable>
			</View>
			<View className="flex-1 justify-center items-center px-8">
				<Ionicons name="hardware-chip-outline" size={64} color={colors.muted} />
				<Text className="text-lg font-bold text-slate-900 dark:text-slate-100 text-center mt-4 mb-2">
					Device Not Supported
				</Text>
				<Text className="text-sm text-slate-500 dark:text-slate-400 text-center">
					Your device doesn't have enough memory to run the AI assistant. This
					feature requires at least 4 GB of RAM.
				</Text>
			</View>
		</SafeAreaView>
	);
};
