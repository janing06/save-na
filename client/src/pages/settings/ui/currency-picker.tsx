import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { currencies } from '@shared/config';

type Props = {
	visible: boolean;
	selectedCurrency: string;
	onSelect: (code: string) => void;
	onClose: () => void;
};

export function CurrencyPicker({
	visible,
	selectedCurrency,
	onSelect,
	onClose,
}: Props) {
	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="pageSheet"
		>
			<View className="flex-1 bg-white pt-6 px-6">
				<View className="flex-row justify-between items-center mb-6">
					<Text className="text-xl font-bold text-slate-900">Currency</Text>
					<Pressable onPress={onClose}>
						<Text className="text-slate-400 text-lg">✕</Text>
					</Pressable>
				</View>
				<FlatList
					data={currencies}
					keyExtractor={(item) => item.code}
					renderItem={({ item }) => {
						const isSelected = selectedCurrency === item.code;
						return (
							<Pressable
								className={`flex-row items-center px-4 py-3 rounded-xl mb-2 ${
									isSelected ? 'bg-teal-50' : 'bg-slate-50'
								}`}
								onPress={() => {
									onSelect(item.code);
									onClose();
								}}
							>
								<Text className="text-base text-slate-900 flex-1">
									{item.symbol} {item.name}
								</Text>
								<Text
									className={`text-sm font-semibold mr-2 ${
										isSelected ? 'text-teal-600' : 'text-slate-400'
									}`}
								>
									{item.code}
								</Text>
								{isSelected && (
									<Text className="text-teal-600 font-bold">✓</Text>
								)}
							</Pressable>
						);
					}}
				/>
			</View>
		</Modal>
	);
}
