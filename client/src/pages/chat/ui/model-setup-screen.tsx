import { Ionicons } from '@expo/vector-icons';
import { LOCAL_MODELS } from '@shared/config';
import { useThemeColors } from '@shared/lib';
import { useColorScheme } from 'nativewind';
import { Pressable, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
	isDownloading: boolean;
	downloadProgress: number;
	onDownload: () => void;
	onCancelDownload: () => void;
	onClose: () => void;
};

export const ModelSetupScreen = ({
	isDownloading,
	downloadProgress,
	onDownload,
	onCancelDownload,
	onClose,
}: Props) => {
	const colors = useThemeColors();
	const { colorScheme } = useColorScheme();
	const model = LOCAL_MODELS[0];

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
			<View className="flex-1 px-6 justify-center">
				<View className="items-center mb-8">
					<View className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-900 items-center justify-center mb-4">
						<Ionicons name="sparkles" size={32} color="#0d9488" />
					</View>
					<Text className="text-xl font-bold text-slate-900 dark:text-slate-100 text-center mb-2">
						AI Budget Assistant
					</Text>
					<Text className="text-sm text-slate-500 dark:text-slate-400 text-center">
						{model.description}
					</Text>
				</View>

				<View className="bg-slate-50 dark:bg-zinc-900 rounded-2xl px-4 py-4 mb-6">
					<View className="flex-row items-center justify-between mb-1">
						<Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">
							Download size
						</Text>
						<Text className="text-sm text-slate-500 dark:text-slate-400">
							{model.sizeLabel}
						</Text>
					</View>
					<Text className="text-xs text-slate-400 dark:text-slate-500">
						Downloaded once and runs entirely on your device — no internet
						needed after setup.
					</Text>
				</View>

				{isDownloading ? (
					<View>
						<View className="h-2 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden mb-2">
							<View
								className="h-full bg-teal-600 rounded-full"
								style={{ width: `${Math.round(downloadProgress * 100)}%` }}
							/>
						</View>
						<View className="flex-row items-center justify-between mb-4">
							<Text className="text-sm text-slate-500 dark:text-slate-400">
								Downloading... {Math.round(downloadProgress * 100)}%
							</Text>
							<Pressable
								onPress={onCancelDownload}
								className="active:opacity-60"
							>
								<Text className="text-sm text-red-500 dark:text-red-400 font-medium">
									Cancel
								</Text>
							</Pressable>
						</View>
					</View>
				) : (
					<Pressable
						onPress={onDownload}
						className="bg-teal-600 rounded-xl py-3.5 active:opacity-80"
					>
						<Text className="font-semibold text-center text-white">
							Download AI Assistant
						</Text>
					</Pressable>
				)}
			</View>
		</SafeAreaView>
	);
};
