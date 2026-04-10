import { Ionicons } from '@expo/vector-icons';
import type { LocalModelConfig } from '@shared/config';
import { useThemeColors } from '@shared/lib';
import { useColorScheme } from 'nativewind';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { DeviceCapability } from '../api/device-check';

type Props = {
	capability: DeviceCapability;
	isDownloading: boolean;
	downloadingModelId: string | null;
	downloadProgress: number;
	onDownload: (model: LocalModelConfig) => void;
	onCancelDownload: () => void;
	onClose: () => void;
};

type ModelCardProps = {
	model: LocalModelConfig;
	isRecommended: boolean;
	isDownloading: boolean;
	downloadProgress: number;
	disabled: boolean;
	onDownload: () => void;
	onCancel: () => void;
};

const ModelCard = ({
	model,
	isRecommended,
	isDownloading,
	downloadProgress,
	disabled,
	onDownload,
	onCancel,
}: ModelCardProps) => (
	<View className="bg-slate-50 dark:bg-zinc-900 rounded-2xl px-4 py-4 mb-3">
		<View className="flex-row items-center justify-between mb-1">
			<View className="flex-row items-center gap-2">
				<Text className="text-base font-bold text-slate-900 dark:text-slate-100">
					{model.label}
				</Text>
				{isRecommended && (
					<View className="bg-teal-100 dark:bg-teal-900 px-2 py-0.5 rounded-full">
						<Text className="text-xs font-semibold text-teal-700 dark:text-teal-300">
							Recommended
						</Text>
					</View>
				)}
			</View>
			<Text className="text-xs text-slate-400 dark:text-slate-500">
				{model.sizeLabel}
			</Text>
		</View>
		<Text className="text-sm text-slate-500 dark:text-slate-400 mb-3">
			{model.description}
		</Text>
		{isDownloading ? (
			<View>
				<View className="h-2 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden mb-2">
					<View
						className="h-full bg-teal-600 rounded-full"
						style={{ width: `${Math.round(downloadProgress * 100)}%` }}
					/>
				</View>
				<View className="flex-row items-center justify-between">
					<Text className="text-xs text-slate-400 dark:text-slate-500">
						{Math.round(downloadProgress * 100)}%
					</Text>
					<Pressable onPress={onCancel} className="active:opacity-60">
						<Text className="text-xs text-red-500 dark:text-red-400 font-medium">
							Cancel
						</Text>
					</Pressable>
				</View>
			</View>
		) : (
			<Pressable
				onPress={onDownload}
				className={`rounded-xl py-2.5 active:opacity-80 ${disabled ? 'bg-slate-300 dark:bg-zinc-700' : 'bg-teal-600'}`}
				disabled={disabled}
			>
				<Text
					className={`font-semibold text-center text-sm ${disabled ? 'text-slate-500 dark:text-zinc-500' : 'text-white'}`}
				>
					Download
				</Text>
			</Pressable>
		)}
	</View>
);

export const ModelSetupScreen = ({
	capability,
	isDownloading,
	downloadingModelId,
	downloadProgress,
	onDownload,
	onCancelDownload,
	onClose,
}: Props) => {
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
			<ScrollView className="flex-1 px-6">
				<Text className="text-lg font-bold text-slate-900 dark:text-slate-100 text-center mb-1">
					Set Up AI Assistant
				</Text>
				<Text className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
					Download a model to use the budget chat assistant
				</Text>
				{capability.availableModels.map((model: LocalModelConfig) => {
					const isThisDownloading =
						isDownloading && downloadingModelId === model.id;
					return (
						<ModelCard
							key={model.id}
							model={model}
							isRecommended={model.id === capability.recommendedModel?.id}
							isDownloading={isThisDownloading}
							downloadProgress={isThisDownloading ? downloadProgress : 0}
							onDownload={() => onDownload(model)}
							onCancel={onCancelDownload}
							disabled={isDownloading && !isThisDownloading}
						/>
					);
				})}
			</ScrollView>
		</SafeAreaView>
	);
};
