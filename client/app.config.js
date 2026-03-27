const APP_ENV = process.env.APP_ENV ?? 'production';

const envConfig = {
	preview: {
		name: 'SaveNa Preview',
		androidPackage: 'com.savena.app.preview',
		iosBundleIdentifier: 'com.savena.app.preview',
	},
	production: {
		name: 'SaveNa',
		androidPackage: 'com.savena.app',
		iosBundleIdentifier: 'com.savena.app',
	},
	development: {
		name: 'SaveNa',
		androidPackage: 'com.savena.app',
		iosBundleIdentifier: 'com.savena.app',
	},
};

const env = envConfig[APP_ENV] ?? envConfig.production;

export default {
	expo: {
		name: env.name,
		slug: 'save-na',
		version: '1.1.0',
		runtimeVersion: {
			policy: 'appVersion',
		},
		updates: {
			url: 'https://u.expo.dev/85911051-68fa-4e9c-a6fe-f824510f0061',
		},
		orientation: 'portrait',
		icon: './assets/images/icon.png',
		scheme: 'save-na',
		userInterfaceStyle: 'automatic',
		newArchEnabled: true,
		ios: {
			supportsTablet: true,
			bundleIdentifier: env.iosBundleIdentifier,
		},
		android: {
			adaptiveIcon: {
				backgroundColor: '#0d9488',
				foregroundImage: './assets/images/android-icon-foreground.png',
				backgroundImage: './assets/images/android-icon-background.png',
				monochromeImage: './assets/images/android-icon-monochrome.png',
			},
			package: env.androidPackage,
			edgeToEdgeEnabled: true,
			predictiveBackGestureEnabled: false,
		},
		plugins: [
			[
				'expo-router',
				{
					root: 'src/app',
				},
			],
			[
				'expo-splash-screen',
				{
					image: './assets/images/splash-icon.png',
					imageWidth: 200,
					resizeMode: 'contain',
					backgroundColor: '#0d9488',
					dark: {
						backgroundColor: '#0d9488',
					},
				},
			],
			'expo-sqlite',
			[
				'expo-notifications',
				{
					icon: './assets/images/icon.png',
					color: '#0d9488',
					defaultChannel: 'default',
				},
			],
		],
		experiments: {
			typedRoutes: true,
			reactCompiler: true,
		},
		extra: {
			router: {
				root: 'src/app',
			},
			eas: {
				projectId: '85911051-68fa-4e9c-a6fe-f824510f0061',
			},
		},
	},
};
