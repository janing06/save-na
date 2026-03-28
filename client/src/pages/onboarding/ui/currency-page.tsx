import { Ionicons } from '@expo/vector-icons';
import { currencies } from '@shared/config';
import { FlatList, Pressable, Text, View } from 'react-native';

type Props = {
	selectedCurrency: string;
	onSelect: (code: string) => void;
	onNext: () => void;
};

export const CurrencyPage = ({ selectedCurrency, onSelect, onNext }: Props) => {
	return (
		<View className="flex-1 bg-white pt-16 px-6">
			<Text className="text-2xl font-bold text-slate-900 mb-2">
				Choose your currency
			</Text>
			<Text className="text-slate-500 mb-6">
				This is the currency you'll budget in.
			</Text>

			<FlatList
				data={currencies}
				keyExtractor={(item) => item.code}
				className="flex-1 mb-4"
				renderItem={({ item }) => {
					const isSelected = selectedCurrency === item.code;
					return (
						<Pressable
							className={`flex-row items-center px-4 py-3 rounded-xl mb-2 ${
								isSelected ? 'bg-teal-50' : 'bg-slate-50'
							}`}
							onPress={() => onSelect(item.code)}
						>
							<Text className="text-base text-slate-900 flex-1">
								{item.name}
							</Text>
							<Text
								className={`text-sm font-semibold mr-2 ${
									isSelected ? 'text-teal-600' : 'text-slate-400'
								}`}
							>
								{item.code}
							</Text>
							{isSelected && (
								<Ionicons name="checkmark" size={18} color="#0d9488" />
							)}
						</Pressable>
					);
				}}
			/>

			<Pressable
				className="bg-teal-600 rounded-full px-8 py-4 items-center mb-8"
				onPress={onNext}
			>
				<Text className="text-white text-base font-bold">Next</Text>
			</Pressable>
		</View>
	);
};
