import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: '#0d9488',
				tabBarInactiveTintColor: '#94a3b8',
				tabBarStyle: {
					backgroundColor: '#ffffff',
					borderTopColor: '#e2e8f0',
				},
			}}
		>
			<Tabs.Screen
				name="budget"
				options={{
					title: 'Budget',
					tabBarIcon: ({ color }) => (
						<Ionicons name="bar-chart" size={22} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="income"
				options={{
					title: 'Income',
					tabBarIcon: ({ color }) => (
						<Ionicons name="cash" size={22} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: 'Settings',
					tabBarIcon: ({ color }) => (
						<Ionicons name="settings-sharp" size={22} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
