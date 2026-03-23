import '../../global.css';
import { Slot } from 'expo-router';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { ActivityIndicator, View } from 'react-native';
import { db } from '@shared/db';
import { seedDefaultCategories } from '@shared/db';
import migrations from '../../drizzle/migrations';
import { Providers } from '@core/providers/providers';
import { useEffect, useState } from 'react';

const RootLayout = () => {
	const { success, error } = useMigrations(db, migrations);
	const [seeded, setSeeded] = useState(false);

	useEffect(() => {
		if (!success) return;
		seedDefaultCategories().then(() => setSeeded(true));
	}, [success]);

	if (error) throw error;

	if (!success || !seeded) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<Providers>
			<Slot />
		</Providers>
	);
};

export default RootLayout;
