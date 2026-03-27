import { Ionicons } from '@expo/vector-icons';
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

const TIME_OPTIONS: { label: string; value: string }[] = Array.from(
	{ length: 17 },
	(_, i) => {
		const hour = 6 + i;
		const value = `${String(hour).padStart(2, '0')}:00`;
		const period = hour < 12 ? 'AM' : 'PM';
		const display = hour === 12 ? 12 : hour % 12;
		return { label: `${display}:00 ${period}`, value };
	},
);

type Props = {
	visible: boolean;
	selectedTime: string;
	onSelect: (time: string) => void;
	onClose: () => void;
};

export const TimePickerModal = ({
	visible,
	selectedTime,
	onSelect,
	onClose,
}: Props) => {
	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
			onRequestClose={onClose}
		>
			<SafeAreaView edges={['top']} className="flex-1 bg-white pt-6 px-6">
				{Platform.OS === 'android' && <StatusBar barStyle="dark-content" />}
				<View className="flex-row justify-between items-center mb-6">
					<Text className="text-xl font-bold text-slate-900">
						Notification Time
					</Text>
					<Pressable onPress={onClose}>
						<Ionicons name="close" size={22} color="#94a3b8" />
					</Pressable>
				</View>
				<FlatList
					data={TIME_OPTIONS}
					keyExtractor={(item) => item.value}
					renderItem={({ item }) => {
						const isSelected = selectedTime === item.value;
						return (
							<Pressable
								className={`flex-row items-center px-4 py-3 rounded-xl mb-2 ${
									isSelected ? 'bg-teal-50' : 'bg-slate-50'
								}`}
								onPress={() => {
									onSelect(item.value);
									onClose();
								}}
							>
								<Text className="text-base text-slate-900 flex-1">
									{item.label}
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
