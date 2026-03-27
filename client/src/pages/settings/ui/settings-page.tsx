import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { currencies } from '@shared/config';
import type { Category, UserPreferences } from '@shared/lib';
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
};

export const SettingsPage = ({
	preferences,
	categories,
	currencyPicker,
	categoryActions,
	onClearData,
}: Props) => {
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
					contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
				>
					{/* Currency section label */}
					<Text className="text-xs font-bold tracking-widest text-slate-400 uppercase mx-4 mt-4 mb-1.5">
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
							If you find SaveNa useful, consider buying me a coffee ☕
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
		</View>
	);
};
