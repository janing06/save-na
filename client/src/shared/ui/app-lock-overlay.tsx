import { getPreferences } from '@shared/db';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Pressable, Text, View } from 'react-native';

type Props = {
	onReady: () => void;
};

export const AppLockOverlay = ({ onReady }: Props) => {
	const [isLocked, setIsLocked] = useState<boolean | null>(null);
	const appLockEnabledRef = useRef(false);
	const appStateRef = useRef(AppState.currentState);

	const authenticate = useCallback(async () => {
		const result = await LocalAuthentication.authenticateAsync({
			promptMessage: 'Unlock SaveNa',
			disableDeviceFallback: false,
		});
		if (result.success) {
			setIsLocked(false);
		}
	}, []);

	// On mount: read preference from SQLite, decide initial lock state
	useEffect(() => {
		const init = async () => {
			try {
				const prefs = await getPreferences();
				const enabled = prefs?.app_lock_enabled === 1;
				appLockEnabledRef.current = enabled;
				if (enabled) {
					setIsLocked(true);
				} else {
					setIsLocked(false);
				}
			} catch {
				setIsLocked(false);
			} finally {
				onReady();
			}
		};
		init();
	}, [onReady]);

	// Auto-trigger auth when locked becomes true
	useEffect(() => {
		if (isLocked) {
			authenticate();
		}
	}, [isLocked, authenticate]);

	// Listen for AppState changes
	useEffect(() => {
		const subscription = AppState.addEventListener('change', (nextState) => {
			if (
				appStateRef.current.match(/inactive|background/) &&
				nextState === 'active'
			) {
				// Re-read preference in case it changed while app was backgrounded
				getPreferences()
					.then((prefs) => {
						const enabled = prefs?.app_lock_enabled === 1;
						appLockEnabledRef.current = enabled;
						if (enabled) {
							setIsLocked(true);
						}
					})
					.catch(() => {});
			}
			appStateRef.current = nextState;
		});

		return () => subscription.remove();
	}, []);

	// Not locked or still loading — don't render overlay
	if (!isLocked) return null;

	return (
		<View className="absolute inset-0 z-50 bg-teal-600 items-center justify-center">
			<Ionicons name="lock-closed" size={48} color="white" />
			<Text className="text-white text-xl font-bold mt-4">SaveNa</Text>
			<Text className="text-teal-200 text-sm mt-1">Tap to unlock</Text>
			<Pressable
				onPress={authenticate}
				className="mt-8 bg-white/20 rounded-full px-8 py-3 active:opacity-60"
			>
				<Text className="text-white font-semibold">Unlock</Text>
			</Pressable>
		</View>
	);
};
