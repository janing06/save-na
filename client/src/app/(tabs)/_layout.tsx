import { Tabs } from 'expo-router';
import { Text } from 'react-native';

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
						<Text style={{ color, fontSize: 20 }}>📊</Text>
					),
				}}
			/>
			<Tabs.Screen
				name="income"
				options={{
					title: 'Income',
					tabBarIcon: ({ color }) => (
						<Text style={{ color, fontSize: 20 }}>💰</Text>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: 'Settings',
					tabBarIcon: ({ color }) => (
						<Text style={{ color, fontSize: 20 }}>⚙️</Text>
					),
				}}
			/>
		</Tabs>
	);
}
