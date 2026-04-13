import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type Props = {
	onNext: () => void;
};

const features = [
	{
		icon: 'lock-closed-outline' as const,
		title: 'Your budget stays private',
		description: 'No sign in needed. Your data stays on your phone.',
	},
	{
		icon: 'wallet-outline' as const,
		title: 'Track your income',
		description: 'Add salary with custom paydays and multiple income sources.',
	},
	{
		icon: 'pie-chart-outline' as const,
		title: 'Budget by category',
		description: 'Allocate income across spending categories.',
	},
	{
		icon: 'calendar-outline' as const,
		title: 'Split across paydays',
		description: 'See your budget divided across each payday.',
	},
];

export const HowItWorksPage = ({ onNext }: Props) => {
	return (
		<View className="flex-1 bg-white px-6 pt-16">
			<Text className="text-2xl font-bold text-slate-900 mb-2">
				How it works
			</Text>
			<Text className="text-slate-500 mb-8">
				A simple budgeting app for your salary.
			</Text>

			<View className="flex-1">
				{features.map((feature) => (
					<View key={feature.title} className="flex-row items-start mb-6">
						<View className="w-12 h-12 rounded-full bg-teal-50 items-center justify-center mr-4">
							<Ionicons name={feature.icon} size={24} color="#0d9488" />
						</View>
						<View className="flex-1">
							<Text className="text-base font-semibold text-slate-900 mb-1">
								{feature.title}
							</Text>
							<Text className="text-sm text-slate-500">
								{feature.description}
							</Text>
						</View>
					</View>
				))}
			</View>

			<Pressable
				className="bg-teal-600 rounded-full px-8 py-4 items-center mb-8"
				onPress={onNext}
			>
				<Text className="text-white text-base font-bold">Next</Text>
			</Pressable>
		</View>
	);
};
