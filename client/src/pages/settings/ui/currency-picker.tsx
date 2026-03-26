import { Ionicons } from '@expo/vector-icons';
import { currencies } from '@shared/config';
import {
	FlatList,
	Modal,
	Platform,
	Pressable,
	StatusBar,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
	visible: boolean;
	selectedCurrency: string;
	onSelect: (code: string) => void;
	onClose: () => void;
};

export const CurrencyPicker = ({
	visible,
	selectedCurrency,
	onSelect,
	onClose,
}: Props) => {
	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="pageSheet"
			onRequestClose={onClose}
		>
			<SafeAreaView edges={['top']} className="flex-1 bg-white pt-6 px-6">
				{Platform.OS === 'android' && <StatusBar barStyle="dark-content" />}
				<View className="flex-row justify-between items-center mb-6">
					<Text className="text-xl font-bold text-slate-900">Currency</Text>
					<Pressable onPress={onClose}>
						<Ionicons name="close" size={22} color="#94a3b8" />
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
			</SafeAreaView>
		</Modal>
	);
};
