import { currencies } from '@shared/config';
import type { Category, UserPreferences } from '@shared/lib';
import { LoadingOverlay, TAB_BAR_CLEARANCE } from '@shared/ui';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { CategoryList } from './category-list';
import { CurrencyPicker } from './currency-picker';

type Props = {
	preferences: UserPreferences | null;
	categories: Category[];
	currencyPicker: {
		visible: boolean;
		onShow: () => void;
		onHide: () => void;
		onUpdate: (currency: string) => void;
	};
	categoryActions: {
		onAdd: () => void;
		onEdit: (cat: Category) => void;
	};
	onClearData: () => void;
	modelName: string | null;
	modelSize: string | null;
	onDeleteModel: () => void;
	onExportBackup: () => void;
	onRestoreBackup: () => void;
	isLoading: boolean;
	theme: 'system' | 'light' | 'dark';
	onThemeChange: (theme: 'system' | 'light' | 'dark') => void;
};

export const SettingsPage = ({
	preferences,
	categories,
	currencyPicker,
	categoryActions,
	onClearData,
	modelName,
	modelSize,
	onDeleteModel,
	onExportBackup,
	onRestoreBackup,
	isLoading,
	theme,
	onThemeChange,
}: Props) => {
	const insets = useSafeAreaInsets();
	const currencyInfo = currencies.find((c) => c.code === preferences?.currency);

	return (
		<View className="flex-1 bg-teal-600 dark:bg-black">
			{/* Teal banner */}
			<SafeAreaView edges={['top']} className="bg-teal-600 dark:bg-black">
				<View className="px-5 py-4">
					<Text className="text-xl font-bold text-white">Settings</Text>
				</View>
			</SafeAreaView>

			{/* Content slides up over teal */}
			<View className="flex-1 bg-slate-100 dark:bg-black rounded-t-3xl -mt-4 overflow-hidden">
				<ScrollView
					className="flex-1"
					contentContainerStyle={{
						paddingTop: 20,
						paddingBottom: insets.bottom + TAB_BAR_CLEARANCE + 16,
					}}
				>
					{/* Currency section label */}
					<Text className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mx-4 mt-4 mb-1.5">
						Currency
					</Text>
					<CategoryList
						categories={categories}
						currencyInfo={currencyInfo}
						onEdit={categoryActions.onEdit}
						onAdd={categoryActions.onAdd}
						onCurrencyPress={currencyPicker.onShow}
					/>

					{/* Appearance section */}
					<Text className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mx-4 mt-6 mb-1.5">
						Appearance
					</Text>
					<View className="mx-4 bg-white dark:bg-zinc-900 rounded-2xl px-4 py-4">
						<Text className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
							Theme
						</Text>
						<View className="flex-row bg-slate-100 dark:bg-black rounded-xl p-1">
							{(['system', 'light', 'dark'] as const).map((option) => (
								<Pressable
									key={option}
									onPress={() => onThemeChange(option)}
									className={`flex-1 py-2 rounded-lg items-center ${
										theme === option ? 'bg-white dark:bg-zinc-900' : ''
									}`}
									style={
										theme === option
											? {
													shadowColor: '#000',
													shadowOffset: { width: 0, height: 1 },
													shadowOpacity: 0.1,
													shadowRadius: 2,
													elevation: 2,
												}
											: undefined
									}
								>
									<Text
										className={`text-sm ${
											theme === option
												? 'font-semibold text-teal-600 dark:text-teal-400'
												: 'text-slate-500 dark:text-slate-400'
										}`}
									>
										{option === 'system'
											? 'Auto'
											: option === 'light'
												? 'Light'
												: 'Dark'}
									</Text>
								</Pressable>
							))}
						</View>
					</View>

					{/* Support section */}
					<Text className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mx-4 mt-6 mb-1.5">
						Support
					</Text>
					<View className="mx-4 bg-white dark:bg-zinc-900 rounded-2xl px-4 py-5 items-center">
						<Text className="text-sm text-slate-500 dark:text-slate-400 text-center mb-4">
							If you find{' '}
							<Text className="text-teal-600 dark:text-teal-400 font-bold">
								SaveNa
							</Text>{' '}
							useful,
							{'\n'}consider buying me a coffee ☕
						</Text>
						<Image
							source={require('../../../../assets/images/instapay-qr.jpg')}
							className="w-[220px] h-[220px]"
							resizeMode="contain"
							accessible
							accessibilityLabel="InstaPay QR code for tipping the developer"
						/>
						<Text className="text-xs text-slate-400 dark:text-slate-500 text-center mt-3">
							Screenshot this QR and scan it in your banking app
						</Text>
					</View>

					{/* AI Assistant section */}
					<Text className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mx-4 mt-6 mb-1.5">
						AI Assistant
					</Text>
					<View className="mx-4 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
						<View className="px-4 py-4">
							<Text className="text-sm font-medium text-slate-900 dark:text-slate-100">
								AI Model
							</Text>
							<Text className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
								{modelName
									? `${modelName} (${modelSize})`
									: 'Not configured — set up in the Chat tab'}
							</Text>
						</View>
						{modelName && (
							<Pressable
								onPress={onDeleteModel}
								className="px-4 py-3 border-t border-slate-100 dark:border-zinc-800 active:opacity-60"
							>
								<Text className="text-sm text-red-500 dark:text-red-400">
									Delete Model
								</Text>
							</Pressable>
						)}
					</View>

					{/* Data section */}
					<Text className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mx-4 mt-6 mb-1.5">
						Data
					</Text>
					<View className="mx-4 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
						<Pressable
							onPress={onExportBackup}
							className="px-4 py-4 active:opacity-60"
						>
							<Text className="text-sm font-medium text-slate-900 dark:text-slate-100">
								Export Backup
							</Text>
							<Text className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
								Save your data as a file
							</Text>
						</Pressable>
						<Pressable
							onPress={onRestoreBackup}
							className="px-4 py-4 border-t border-slate-100 dark:border-zinc-800 active:opacity-60"
						>
							<Text className="text-sm font-medium text-slate-900 dark:text-slate-100">
								Restore Backup
							</Text>
							<Text className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
								Import data from a file
							</Text>
						</Pressable>
					</View>

					<Text className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mx-4 mt-6 mb-1.5">
						Danger Zone
					</Text>
					<View className="mx-4 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
						<Pressable
							onPress={onClearData}
							className="px-4 py-4 active:opacity-60"
						>
							<Text className="text-red-500 dark:text-red-400 font-medium">
								Clear All Data
							</Text>
							<Text className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
								Delete all budget items, income sources, and preferences
							</Text>
						</Pressable>
					</View>

					<View className="mt-6 mb-4">
						<Text className="text-xs text-slate-300 dark:text-slate-600 text-center">
							SaveNa v1.2.0
						</Text>
					</View>
				</ScrollView>
			</View>

			<CurrencyPicker
				visible={currencyPicker.visible}
				selectedCurrency={preferences?.currency ?? 'PHP'}
				onSelect={currencyPicker.onUpdate}
				onClose={currencyPicker.onHide}
			/>

			<LoadingOverlay visible={isLoading} />
		</View>
	);
};
