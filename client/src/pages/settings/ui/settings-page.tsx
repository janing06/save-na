import { currencies } from '@shared/config';
import type { Category, UserPreferences } from '@shared/lib';
import { LoadingOverlay, TAB_BAR_CLEARANCE } from '@shared/ui';
import { Image, Pressable, ScrollView, Switch, Text, View } from 'react-native';
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
	apiKey: string | null;
	onRemoveApiKey: () => void;
	isLoading: boolean;
	onToggleAppLock: (enabled: boolean) => void;
};

export const SettingsPage = ({
	preferences,
	categories,
	currencyPicker,
	categoryActions,
	onClearData,
	apiKey,
	onRemoveApiKey,
	isLoading,
	onToggleAppLock,
}: Props) => {
	const insets = useSafeAreaInsets();
	const currencyInfo = currencies.find((c) => c.code === preferences?.currency);

	return (
		<View className="flex-1 bg-teal-600">
			{/* Teal banner */}
			<SafeAreaView edges={['top']} className="bg-teal-600">
				<View className="px-5 py-4">
					<Text className="text-xl font-bold text-white">Settings</Text>
				</View>
			</SafeAreaView>

			{/* White content slides up over teal */}
			<View className="flex-1 bg-slate-100 rounded-t-3xl -mt-4 overflow-hidden">
				<ScrollView
					className="flex-1"
					contentContainerStyle={{
						paddingTop: 20,
						paddingBottom: insets.bottom + TAB_BAR_CLEARANCE + 16,
					}}
				>
					{/* Security section */}
					<Text className="text-xs font-bold tracking-widest text-slate-400 uppercase mx-4 mt-4 mb-1.5">
						Security
					</Text>
					<View className="mx-4 bg-white rounded-2xl overflow-hidden">
						<View className="px-4 py-4 flex-row items-center justify-between">
							<View className="flex-1 mr-3">
								<Text className="text-sm font-medium text-slate-700">
									App Lock
								</Text>
								<Text className="text-xs text-slate-400 mt-0.5">
									Require authentication when opening the app
								</Text>
							</View>
							<Switch
								value={preferences?.app_lock_enabled === 1}
								onValueChange={onToggleAppLock}
								trackColor={{ true: '#0d9488' }}
							/>
						</View>
					</View>

					{/* Currency section label */}
					<Text className="text-xs font-bold tracking-widest text-slate-400 uppercase mx-4 mt-6 mb-1.5">
						Currency
					</Text>
					<CategoryList
						categories={categories}
						currencyInfo={currencyInfo}
						onEdit={categoryActions.onEdit}
						onAdd={categoryActions.onAdd}
						onCurrencyPress={currencyPicker.onShow}
					/>

					{/* Support section */}
					<Text className="text-xs font-bold tracking-widest text-slate-400 uppercase mx-4 mt-6 mb-1.5">
						Support
					</Text>
					<View className="mx-4 bg-white rounded-2xl px-4 py-5 items-center">
						<Text className="text-sm text-slate-700 text-center mb-4">
							If you find{' '}
							<Text className="text-teal-600 font-bold">SaveNa</Text> useful,
							{'\n'}consider buying me a coffee ☕
						</Text>
						<Image
							source={require('../../../../assets/images/instapay-qr.jpg')}
							className="w-[220px] h-[220px]"
							resizeMode="contain"
							accessible
							accessibilityLabel="InstaPay QR code for tipping the developer"
						/>
						<Text className="text-xs text-slate-400 text-center mt-3">
							Screenshot this QR and scan it in your banking app
						</Text>
					</View>

					{/* AI Assistant section */}
					<Text className="text-xs font-bold tracking-widest text-slate-400 uppercase mx-4 mt-6 mb-1.5">
						AI Assistant
					</Text>
					<View className="mx-4 bg-white rounded-2xl overflow-hidden">
						<View className="px-4 py-4">
							<Text className="text-sm font-medium text-slate-700">
								API Key
							</Text>
							<Text className="text-xs text-slate-400 mt-0.5">
								{apiKey
									? `Configured: ${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`
									: 'Not configured — set up in the Chat tab'}
							</Text>
						</View>
						{apiKey && (
							<Pressable
								onPress={onRemoveApiKey}
								className="px-4 py-3 border-t border-slate-100 active:opacity-60"
							>
								<Text className="text-sm text-red-500">Remove API Key</Text>
							</Pressable>
						)}
					</View>

					<Text className="text-xs font-bold tracking-widest text-slate-400 uppercase mx-4 mt-6 mb-1.5">
						Danger Zone
					</Text>
					<View className="mx-4 bg-white rounded-2xl overflow-hidden">
						<Pressable
							onPress={onClearData}
							className="px-4 py-4 active:opacity-60"
						>
							<Text className="text-red-500 font-medium">Clear All Data</Text>
							<Text className="text-xs text-slate-400 mt-0.5">
								Delete all budget items, income sources, and preferences
							</Text>
						</Pressable>
					</View>

					<View className="mt-6 mb-4">
						<Text className="text-xs text-slate-300 text-center">
							SaveNa v1.1.0
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
