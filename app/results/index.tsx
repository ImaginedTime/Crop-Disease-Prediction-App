import {
	View,
	Text,
	Image,
	StyleSheet,
	Dimensions,
	ScrollView,
	Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { getItem } from "@/common/storage";

import enContent from "@/data/en-content";

export default function results() {
	const navigator = useNavigation<any>();
	let { ...data } = useLocalSearchParams();

	// get the image from the async storage and save it to the state
	const [imageUri, setImageUri] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			const retrievedImageBase64 = await getItem("imageBase64");

			setImageUri(
				`data:image/jpeg;base64,${retrievedImageBase64 as string}`
			);
		})();
	}, []);

	return (
		<SafeAreaView className="flex-1">
			<View className="mt-4 mb-6 sticky justify-center">
				<Pressable
					className="absolute z-10"
					onPress={() => {
						console.log("Navigating back to camera");
						navigator.navigate("(tabs)", { screen: "camera" });
					}}
				>
					<Image
						source={require("@/assets/icons/back.png")}
						className="w-8 ml-4"
						resizeMode="contain"
					/>
				</Pressable>
				<Text className="text-3xl text-center font-bold">
					{enContent.resultsContent.title}
				</Text>
			</View>

			<ScrollView
				className="flex-1"
				contentContainerStyle={{ paddingBottom: 10 }}
			>
				<View
					className="rounded-3xl overflow-hidden border-4 border-[#208F4F] mx-auto"
					style={styles.imageContainer}
				>
					<Image
						source={{
							uri: imageUri ?? "https://via.placeholder.com/150",
						}}
						resizeMode="cover"
						className="w-full h-full"
					/>
				</View>

				<View className="px-4 mt-4">
					<Text className="text-lg font-light mb-1">
						{enContent.resultsContent.confidenceTextPart1}{" "}
						{Number(
							parseFloat(data.confidence as string).toFixed(4)
						) * 100}
						{enContent.resultsContent.confidenceTextPart2}{" "}
					</Text>
					<Text className="text-3xl font-bold capitalize">
						{data.className}
					</Text>
				</View>

				{/* Create an accordion that shows the title summary and has some content inside of it. Use the react native reanimated library for the animation */}

				<View className="px-4 py-2 mt-4 bg-green-200 mx-4 rounded-xl">
					<Text className="text-lg font-light mb-1">
						{enContent.resultsContent.sectionNames[0]}
					</Text>
					<Text className="text-base font-normal">
						Groundnut rosette is a disease that affects groundnut
						plants. It is caused by a virus and is transmitted by
						aphids. The disease is characterized by the appearance
						of yellow spots on the leaves of the plant. The spots
						eventually turn brown and the leaves fall off. The
						disease can be controlled by using resistant varieties
						of groundnut and by controlling the aphid population.
					</Text>
				</View>

				{/* How to identify */}

				<View className="px-4 py-2 mt-4 bg-green-200 mx-4 rounded-xl">
					<Text className="text-lg font-light mb-1">
						{enContent.resultsContent.sectionNames[1]}
					</Text>
					<Text className="text-base font-normal">
						The disease can be identified by the appearance of
						yellow spots on the leaves of the plant. The spots
						eventually turn brown and the leaves fall off. The
						disease can be controlled by using resistant varieties
						of groundnut and by controlling the aphid population.
					</Text>
				</View>

				{/* How to prevent */}
				<View className="px-4 py-2 mt-4 bg-green-200 mx-4 rounded-xl">
					<Text className="text-lg font-light mb-1">
						{enContent.resultsContent.sectionNames[2]}
					</Text>
					<Text className="text-base font-normal">
						The disease can be prevented by using resistant
						varieties of groundnut and by controlling the aphid
						population. Insecticides can also be used to control the
						aphid population and prevent the spread of the disease.
					</Text>
				</View>

				{/* How to treat */}
				<View className="px-4 py-2 mt-4 bg-green-200 mx-4 rounded-xl">
					<Text className="text-lg font-light mb-1">
						{enContent.resultsContent.sectionNames[3]}
					</Text>
					<Text className="text-base font-normal">
						The disease can be treated by using resistant varieties
						of groundnut and by controlling the aphid population. In
						severe cases, chemical sprays can be used to control the
						aphid population.
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	imageContainer: {
		width: Dimensions.get("window").width * 0.9,
		height: Dimensions.get("window").width * 0.9,
	},
});
