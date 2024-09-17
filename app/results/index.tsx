import {
	View,
	Text,
	Image,
	StyleSheet,
	Dimensions,
	ScrollView,
	Pressable,
	BackHandler,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { getItem } from "@/common/storage";
import useContent from "@/hook/useContent";
import MyTTS from "@/components/tts";

import * as Speech from "expo-speech";

export default function results() {
	const navigator = useNavigation<any>();

	const content = useContent();

	const [className, setClassName] = useState<string>("");
	const [confidence, setConfidence] = useState<string>("");
	const [sections, setSections] = useState<any>({});

	const [titles, setTitles] = useState<string[]>([]);
	const [titlesLang, setTitlesLang] = useState<string[]>([]);

	const [combinedContent, setCombinedContent] = useState<string[]>([]);

	// get the image from the async storage and save it to the state
	const [imageUri, setImageUri] = useState<string | null>(null);

	BackHandler.addEventListener("hardwareBackPress", () => {
		console.log("Navigating back to camera");
		Speech.stop();
		navigator.navigate("(tabs)", { screen: "camera" });
		return true;
	});

	useEffect(() => {
		(async () => {
			try {
				const retrievedImageBase64 = await getItem("imageBase64");

				let data = (await getItem("results")) as any;

				data = await JSON.parse(data);

				console.log(data);

				if (Object.keys(data.info).includes("Disease Name")) {
					setTitles([
						"Summary",
						"How to Identify",
						"How to Prevent",
						"How to Treat",
					]);
					setClassName(data.info["Disease Name Lang"]);
				} else {
					setTitles([
						"Summary",
						"How to Identify",
						"How to Maintain",
						"How to Treat",
					]);
					setClassName(data.info["Crop Name"]);
				}

				setSections(data.info);
				setConfidence(data.confidence);

				setImageUri(
					`data:image/jpeg;base64,${retrievedImageBase64 as string}`
				);
			} catch (error) {
				console.error(error);
			}
		})();
	}, []);

	useEffect(() => {
		let combinedContent = [] as string[];

		combinedContent.push(
			content.resultsContent.confidenceTextPart1 +
				" " +
				(Number(parseFloat(confidence as string)) * 100)
					.toString()
					.substring(0, 5) +
				" " +
				content.resultsContent.confidenceTextPart2 +
				" " +
				className +
				" "
		);

		for (let i = 0; i < titles.length; i++) {
			combinedContent.push(
				titlesLang[i] + " " + sections[titles[i]] + " "
			);
		}

		setCombinedContent(combinedContent);

		if (
			sections.info &&
			Object.keys(sections.info).includes("Disease Name")
		) {
			setTitlesLang(content.resultsContent.sectionNamesDisease);
		} else {
			setTitlesLang(content.resultsContent.sectionNamesHealthy);
		}
	}, [content, sections, titles, className, confidence]);

	return (
		<SafeAreaView className="flex-1">
			<View className="mt-4 mb-6 sticky justify-center">
				<Pressable
					className="absolute z-10"
					onPress={() => {
						console.log("Navigating back to camera");
						Speech.stop();
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
					{content.resultsContent.title}
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
						{content.resultsContent.confidenceTextPart1}{" "}
						{(Number(parseFloat(confidence as string)) * 100)
							.toString()
							.substring(0, 5)}
						{content.resultsContent.confidenceTextPart2}{" "}
					</Text>
					<Text className="text-3xl font-bold capitalize">
						{className}
					</Text>
				</View>

				{titles.map((title: string, index: number) => (
					<View
						key={index}
						className="px-4 py-2 mt-4 bg-green-200 mx-4 rounded-xl"
					>
						<Text className="text-lg font-light mb-1">
							{titlesLang[index]}
						</Text>
						<Text className="text-base font-normal">
							{sections[title]}
						</Text>
					</View>
				))}
			</ScrollView>

			<MyTTS texts={combinedContent} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	imageContainer: {
		width: Dimensions.get("window").width * 0.9,
		height: Dimensions.get("window").width * 0.9,
	},
});
