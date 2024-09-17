import { View, StyleSheet, Button, Image, Pressable } from "react-native";
import * as Speech from "expo-speech";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";
import { langCodes } from "@/data";

interface LangCodes {
	[key: string]: string;
}

export default function MyTTS({ texts }: { texts: string[] }) {
	const { lang } = useContext(UserContext);

	const speak = async () => {
		for(let text of texts) {
			Speech.speak(text, {
				language: (langCodes as LangCodes)[lang] || "en",
				rate: 0.85,
			});

			// wait for the speech to finish and take a break of 1 second
			setTimeout(() => {}, 1000);
		}
	};

	return (
		<Pressable
			className="bg-[#208F4F] absolute bottom-6 right-6 rounded-full p-2"
			onPress={speak}
		>
			<Image
				source={require("@/assets/icons/tts.png")}
				style={{ width: 32, height: 32 }}
				resizeMode="contain"
			/>
		</Pressable>
	);
}
