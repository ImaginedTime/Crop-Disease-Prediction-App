import { getItem } from "@/common/storage";
import { UserProvider } from "@/context/userContext";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
	initialRouteName: "lang",
};

export default function RootLayout() {
	const [onboarded, setOnboarded] = useState(false);

	useEffect(() => {
		(async () => {
			let onboarded = await getItem("onboarded");

			let lang = await getItem("lang");

			if (onboarded) {
				setOnboarded(true);
			}
		})();
	}, []);

	return (
		<UserProvider>
			<GestureHandlerRootView>
				<Stack
					initialRouteName={`"lang"`}
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen name="lang" />
					<Stack.Screen name="(onboarding)/index" />
					<Stack.Screen name="results/index" />
					<Stack.Screen name="(tabs)" />
				</Stack>
			</GestureHandlerRootView>
		</UserProvider>
	);
}
