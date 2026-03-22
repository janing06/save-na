import { Pressable, Text, View } from 'react-native';

type Props = {
	onNext: () => void;
};

export function WelcomePage({ onNext }: Props) {
	return (
		<View className="flex-1 items-center justify-center bg-white px-8">
			<Text className="text-4xl font-extrabold text-teal-600 mb-3">SaveNa</Text>
			<Text className="text-base text-slate-500 text-center mb-12">
				Budget your salary, split across paydays, track your progress.
			</Text>
			<Pressable
				className="bg-teal-600 rounded-full px-8 py-4 w-full items-center"
				onPress={onNext}
			>
				<Text className="text-white text-base font-bold">Get Started</Text>
			</Pressable>
		</View>
	);
}
