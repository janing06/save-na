import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { IncomeSource } from '@shared/lib';
import { formatCurrency } from '@shared/lib';
import type { useCreateIncomeSource } from '../model/hooks/use-create-income-source';
import type { useDeleteIncomeSource } from '../model/hooks/use-delete-income-source';
import type { useUpdateIncomeSource } from '../model/hooks/use-update-income-source';
import { IncomeSourceCard } from './income-source-card';
import { IncomeSourceModal } from './income-source-modal';

type Props = {
	sources: IncomeSource[];
	isLoading: boolean;
	currency: string;
	create: ReturnType<typeof useCreateIncomeSource>;
	update: ReturnType<typeof useUpdateIncomeSource>;
	remove: ReturnType<typeof useDeleteIncomeSource>;
};

export function IncomePage({
	sources,
	isLoading,
	currency,
	create,
	update,
	remove,
}: Props) {
	const modalVisible = create.showModal || !!update.editingSource;
	const totalIncome = sources.reduce((sum, s) => sum + s.amount, 0);

	return (
		<View className="flex-1 bg-teal-600">
			{/* Teal banner */}
			<SafeAreaView edges={['top']} className="bg-teal-600">
				<View className="flex-row justify-between items-center px-5 py-4">
					<Text className="text-xl font-bold text-white">Income Sources</Text>
					{sources.length > 0 && (
						<Text className="text-sm text-white/80">
							{formatCurrency(totalIncome, currency)}
						</Text>
					)}
				</View>
			</SafeAreaView>

			{/* White content slides up over teal */}
			<View className="flex-1 bg-slate-100 rounded-t-3xl -mt-4 overflow-hidden">
				<FlatList
					data={sources}
					keyExtractor={(item) => String(item.id)}
					contentContainerStyle={{ paddingTop: 16, paddingBottom: 80 }}
					renderItem={({ item }) => (
						<IncomeSourceCard
							source={item}
							currency={currency}
							onEdit={update.onEdit}
							onDelete={remove.onDelete}
						/>
					)}
					ListEmptyComponent={
						<Text className="text-slate-400 text-sm text-center mt-16">
							No income sources yet.{'\n'}Tap + to add one.
						</Text>
					}
				/>

				<Pressable
					className="absolute bottom-6 right-6 bg-teal-600 w-12 h-12 rounded-full items-center justify-center shadow-lg"
					style={{ shadowColor: '#0d9488' }}
					onPress={create.onShow}
				>
					<Text className="text-white text-2xl">+</Text>
				</Pressable>
			</View>

			<IncomeSourceModal
				visible={modalVisible}
				editingSource={update.editingSource}
				onSubmit={update.editingSource ? update.onSubmit : create.onSubmit}
				onClose={update.editingSource ? update.onCancel : create.onHide}
				isPending={create.isPending || update.isPending}
			/>
		</View>
	);
}
