import { Image, View } from "react-native";

export default function Splash() {
	return (
		<View className="flex-1 items-center justify-center p-10 bg-[#208F4F]">
			<Image
				source={require("@/assets/images/splash-screen.png")}
				resizeMode="contain"
			/>
		</View>
	);
}