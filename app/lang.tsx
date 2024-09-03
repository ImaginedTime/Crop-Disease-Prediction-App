import { View, Text, ScrollView, Pressable, ToastAndroid } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserContext } from "@/context/userContext";

import { LangOptions, langOptions } from "@/data";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import useContent from "@/hook/useContent";
import { getItem } from "@/common/storage";

export default function index() {
	const navigator = useNavigation<any>();
	const { lang, setLang } = useContext(UserContext);
	const langs = langOptions as LangOptions;

	const content = useContent();

	return (
		<SafeAreaView className="flex-1">
			<View>
				<Text className="text-2xl font-bold p-4 pb-0">
					{content.langSelector.title}
				</Text>
				<Text className="text-lg p-4 text-gray-500">
					{content.langSelector.description}
				</Text>
			</View>
			<ScrollView className="flex-1">
				{Object.keys(langOptions).map((key) => (
					<Pressable
						key={key}
						className={`
							flex flex-row justify-between items-center p-4
							border-b border-gray-200
							${lang === key ? "bg-[#208F4F]" : "bg-white"}
						`}
						onPress={() => setLang(key)}
					>
						<Text
							className={`text-lg ${
								lang === key ? "text-white" : "text-gray-500"
							}`}
						>
							{langs[key as keyof LangOptions]}
						</Text>
					</Pressable>
				))}
			</ScrollView>
			<Pressable
				className="p-4 bg-[#208F4F] m-4 rounded-full"
				onPress={async () => {
					if (lang === "") {
						ToastAndroid.show(
							"Please select a language",
							ToastAndroid.SHORT
						);

						return;
					}
					let onboarded = await getItem("onboarded");

					if (onboarded) {
						navigator.navigate("(tabs)");
						return;
					}

					navigator.navigate("(onboarding)/index");
				}}
			>
				<Text className={`text-lg text-white text-center`}>
					{content.langSelector.continueButtonText}
				</Text>
			</Pressable>
		</SafeAreaView>
	);
}
