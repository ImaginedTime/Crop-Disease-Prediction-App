import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
	// Ensure any route can link back to `/`
	initialRouteName: "results/index",
};

export default function RootLayout() {
	return (
		<GestureHandlerRootView>
			<Stack
				initialRouteName="(onboarding)/index"
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="(onboarding)/index" />
				<Stack.Screen name="results/index" />
				<Stack.Screen name="(tabs)" />
			</Stack>
		</GestureHandlerRootView>
	);
}
