import { FloatingTabBar } from '@shared/ui';
import { Tabs } from 'expo-router';

const TabLayout = () => {
	return (
		<Tabs
			screenOptions={{ headerShown: false }}
			tabBar={(props) => <FloatingTabBar {...props} />}
		>
			<Tabs.Screen name="budget" options={{ title: 'Budget' }} />
			<Tabs.Screen name="income" options={{ title: 'Income' }} />
			<Tabs.Screen name="chat" options={{ href: null }} />
			<Tabs.Screen name="settings" options={{ title: 'Settings' }} />
		</Tabs>
	);
};

export default TabLayout;
