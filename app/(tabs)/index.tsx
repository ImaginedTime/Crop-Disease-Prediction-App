import {
	View,
	Text,
	Image,
	Dimensions,
	ImageBackground,
	Pressable,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Link, useNavigation } from "expo-router";

import useContent from "@/hook/useContent";

export default function index() {
	const navigator = useNavigation<any>();

	const content = useContent();

	return (
		<SafeAreaView>
			<ScrollView>
				<View
					className="h-[40vh] w-[110vw] bg-[#208F4F] absolute top-0"
					style={{
						borderBottomLeftRadius: 100,
						borderBottomRightRadius: 100,
						transform: [
							{
								translateX:
									-0.05 * Dimensions.get("window").width,
							},
						],
					}}
				></View>

				<Pressable
					className="absolute right-0 bg-gray-500 rounded-xl m-4 p-2"
					onPress={() => {
						navigator.navigate("lang");
					}}
				>
					<Image
						source={require("@/assets/icons/lang.png")}
						className="w-6 h-6"
					/>
				</Pressable>

				<View className="px-6 py-10 relative">
					<View>
						<Text className="text-white text-xl font-semibold">
							{content.homeData.title}
						</Text>
						<Text className="text-white text-sm font-semibold">
							{content.homeData.description}
						</Text>
					</View>

					<Pressable
						onPress={() => {
							navigator.navigate("(tabs)", { screen: "camera" });
						}}
						className="bg-white h-[20vh] w-full rounded-3xl mt-24 shadow-2xl items-center justify-center flex-row"
					>
						<View className="justify-center items-center">
							<View className="border-2 border-[#208F4F] rounded-full p-3 mb-2">
								<Image
									source={require("@/assets/icons/click.png")}
									className="w-8 h-8"
								/>
							</View>
							<Text
								className="text-center"
								style={{
									maxWidth:
										Dimensions.get("window").width * 0.25,
								}}
							>
								{content.homeData.guideTexts[0]}
							</Text>
						</View>

						<Image
							source={require("@/assets/icons/next.png")}
							resizeMode="contain"
							className="w-6 mb-6"
						/>

						<View className="justify-center items-center">
							<View className="border-2 border-[#208F4F] rounded-full p-3 mb-2">
								<Image
									source={require("@/assets/icons/upload.png")}
									className="w-8 h-8"
								/>
							</View>
							<Text
								className="text-center"
								style={{
									maxWidth:
										Dimensions.get("window").width * 0.3,
								}}
							>
								{content.homeData.guideTexts[1]}
							</Text>
						</View>

						<Image
							source={require("@/assets/icons/next.png")}
							resizeMode="contain"
							className="w-6 mb-6"
						/>

						<View className="justify-center items-center">
							<View className="border-2 border-[#208F4F] rounded-full p-3 mb-2">
								<Image
									source={require("@/assets/icons/solution.png")}
									className="w-8 h-8"
								/>
							</View>
							<Text
								className="text-center"
								style={{
									maxWidth:
										Dimensions.get("window").width * 0.25,
								}}
							>
								{content.homeData.guideTexts[2]}
							</Text>
						</View>
					</Pressable>
				</View>

				<View className="px-6 mb-6">
					<Text className="text-xl font-bold">
						{content.homeData.categoriesTitle}
					</Text>

					<ImageBackground
						source={require("@/assets/images/seasonal-crops.png")}
						resizeMode="cover"
						imageStyle={{ borderRadius: 20 }}
						className="mt-6 mb-2"
					>
						<View
							className="bg-[#00000066] p-5"
							style={{ borderRadius: 20 }}
						>
							<Text className="text-white text-xl uppercase text-center font-bold">
								{content.homeData.categories[0]}
							</Text>
						</View>
					</ImageBackground>

					<ImageBackground
						source={require("@/assets/images/commercial-crops.png")}
						resizeMode="cover"
						imageStyle={{ borderRadius: 20 }}
					>
						<View
							className="bg-[#00000066] p-5"
							style={{ borderRadius: 20 }}
						>
							<Text className="text-white text-xl uppercase text-center font-bold">
								{content.homeData.categories[1]}
							</Text>
						</View>
					</ImageBackground>

					<View className="flex flex-wrap flex-row justify-between mt-4">
						{new Array(4).fill(0).map((_, i) => (
							<View
								key={i}
								className="bg-[#ccc] w-20 h-20 rounded-xl"
							></View>
						))}
					</View>

					<View className="flex flex-wrap flex-row justify-between mt-4">
						{new Array(4).fill(0).map((_, i) => (
							<View
								key={i}
								className="bg-[#ccc] w-20 h-20 rounded-xl"
							></View>
						))}
					</View>

					<View className="flex flex-wrap flex-row justify-between mt-4">
						{new Array(2).fill(0).map((_, i) => (
							<View
								key={i}
								className="bg-[#ccc] w-20 h-20 rounded-xl"
							></View>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
