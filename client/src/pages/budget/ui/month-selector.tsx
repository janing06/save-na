import { Pressable, Text, View } from 'react-native';

type Props = {
	label: string;
	onPrev: () => void;
	onNext: () => void;
};

export function MonthSelector({ label, onPrev, onNext }: Props) {
	return (
		<View className="flex-row items-center justify-between px-5 py-3">
			<Pressable onPress={onPrev} className="p-2">
				<Text className="text-white/80 text-xl">‹</Text>
			</Pressable>
			<Text className="text-lg font-bold text-white tracking-wide">{label}</Text>
			<Pressable onPress={onNext} className="p-2">
				<Text className="text-white/80 text-xl">›</Text>
			</Pressable>
		</View>
	);
}
