import React from "react";
import { Tabs } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function _layout() {
	const icons = [
		require("@/assets/icons/home.png"),
		require("@/assets/icons/community.png"),
		require("@/assets/icons/camera.png"),
		require("@/assets/icons/weather.png"),
		require("@/assets/icons/statistics.png"),
	];

	const activeIcons = [
		require("@/assets/icons/home-white.png"),
		require("@/assets/icons/community-white.png"),
		require("@/assets/icons/camera.png"),
		require("@/assets/icons/weather-white.png"),
		require("@/assets/icons/statistics-white.png"),
	];

	return (
		<Tabs
			initialRouteName="index"
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: "#fff",
					borderTopWidth: 0,
					height: 60,
					borderTopLeftRadius: 20,
					borderTopRightRadius: 20,
				},
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarIcon: ({ focused }) => (
						<Image
							source={focused ? activeIcons[0] : icons[0]}
							style={{ width: 28, height: 28 }}
							resizeMode="contain"
						/>
					),
					tabBarActiveBackgroundColor: "#208F4F",
				}}
			/>
			<Tabs.Screen
				name="community"
				options={{
					tabBarIcon: ({ focused }) => (
						<Image
							source={focused ? activeIcons[1] : icons[1]}
							style={{ width: 28, height: 28 }}
							resizeMode="contain"
						/>
					),
					tabBarActiveBackgroundColor: "#208F4F",
				}}
			/>
			<Tabs.Screen
				name="camera"
				options={{
					tabBarIcon: ({ focused }) => (
						<Image source={icons[2]} className="-translate-y-4" />
					),
				}}
			/>
			<Tabs.Screen
				name="weather"
				options={{
					tabBarIcon: ({ focused }) => (
						<Image
							source={focused ? activeIcons[3] : icons[3]}
							style={{ width: 28, height: 28 }}
							resizeMode="contain"
						/>
					),
					tabBarActiveBackgroundColor: "#208F4F",
				}}
			/>
			<Tabs.Screen
				name="statistics"
				options={{
					tabBarIcon: ({ focused }) => (
						<Image
							source={focused ? activeIcons[4] : icons[4]}
							style={{ width: 28, height: 28 }}
							resizeMode="contain"
						/>
					),
					tabBarActiveBackgroundColor: "#208F4F",
				}}
			/>
		</Tabs>
	);
}
