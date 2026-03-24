import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type Props = {
	label: string;
	onPrev: () => void;
	onNext: () => void;
	isCurrentMonth: boolean;
	hasPrevMonth: boolean;
};

export const MonthSelector = ({
	label,
	onPrev,
	onNext,
	isCurrentMonth,
	hasPrevMonth,
}: Props) => {
	return (
		<View className="flex-row items-center justify-between px-5 py-3">
			<Pressable
				onPress={onPrev}
				className="p-2"
				disabled={!hasPrevMonth}
				style={{ opacity: hasPrevMonth ? 1 : 0 }}
			>
				<Ionicons name="chevron-back" size={22} color="rgba(255,255,255,0.8)" />
			</Pressable>
			<Text className="text-lg font-bold text-white tracking-wide">
				{label}
			</Text>
			<Pressable
				onPress={onNext}
				className="p-2"
				disabled={isCurrentMonth}
				style={{ opacity: isCurrentMonth ? 0 : 1 }}
			>
				<Ionicons
					name="chevron-forward"
					size={22}
					color="rgba(255,255,255,0.8)"
				/>
			</Pressable>
		</View>
	);
};
