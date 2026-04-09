import { Ionicons } from '@expo/vector-icons';
import type { IncomeSource } from '@shared/lib';
import { formatCurrency, useThemeColors } from '@shared/lib';
import { useColorScheme } from 'nativewind';
import { LoadingOverlay } from '@shared/ui';
import { FlatList, Pressable, Text, View } from 'react-native';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { IncomeSourceCard } from './income-source-card';

type Props = {
	sources: IncomeSource[];
	currency: string;
	onAdd: () => void;
	onEdit: (source: IncomeSource) => void;
	onDelete: (id: number) => void;
	isLoading: boolean;
};

export const IncomePage = ({
	sources,
	currency,
	onAdd,
	onEdit,
	onDelete,
	isLoading,
}: Props) => {
	const totalIncome = sources.reduce((sum, s) => sum + s.amount, 0);
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();
	const { colorScheme } = useColorScheme();
	const fabIconColor = colorScheme === 'dark' ? '#000000' : 'white';

	return (
		<View className="flex-1 bg-teal-600 dark:bg-black">
			{/* Teal banner */}
			<SafeAreaView edges={['top']} className="bg-teal-600 dark:bg-black">
				<View className="flex-row justify-between items-center px-5 py-4">
					<Text className="text-xl font-bold text-white">Income Sources</Text>
					{sources.length > 0 && (
						<Text className="text-sm text-white/80">
							{formatCurrency(totalIncome, currency)}
						</Text>
					)}
				</View>
			</SafeAreaView>

			{/* Content slides up over teal */}
			<View className="flex-1 bg-slate-100 dark:bg-black rounded-t-3xl -mt-4 overflow-hidden">
				<FlatList
					data={sources}
					keyExtractor={(item) => String(item.id)}
					contentContainerStyle={{
						paddingTop: 16,
						paddingBottom: insets.bottom + 80,
					}}
					renderItem={({ item }) => (
						<IncomeSourceCard
							source={item}
							currency={currency}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					)}
					ListEmptyComponent={
						<Text className="text-slate-400 dark:text-slate-500 text-sm text-center mt-16">
							No income sources yet.{'\n'}Tap + to add one.
						</Text>
					}
				/>

				<Pressable
					className="absolute right-6 bg-teal-600 w-12 h-12 rounded-full items-center justify-center shadow-lg"
					style={{ bottom: insets.bottom + 16, shadowColor: colors.brand }}
					onPress={onAdd}
				>
					<Ionicons name="add" size={28} color={fabIconColor} />
				</Pressable>
			</View>

			<LoadingOverlay visible={isLoading} />
		</View>
	);
};
