import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';

const TabLayout = () => {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: '#0d9488',
				tabBarInactiveTintColor: '#94a3b8',
				tabBarStyle: { backgroundColor: '#ffffff', borderTopColor: '#e2e8f0' },
			}}
		>
			<Tabs.Screen
				name="budget"
				options={{
					title: 'Budget',
					tabBarIcon: ({ color }) => (
						<FontAwesome6 name="chart-simple" size={22} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="income"
				options={{
					title: 'Income',
					tabBarIcon: ({ color }) => (
						<Entypo name="wallet" size={22} color={color} />
					),
				}}
			/>
			<Tabs.Screen name="chat" options={{ href: null }} />
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
};

export default TabLayout;
