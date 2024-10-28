import { CameraView, useCameraPermissions } from "expo-camera";
import { useContext, useRef, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Image,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import SelectDropdown from "react-native-select-dropdown";

import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import axios from "axios";

import { setItem } from "@/common/storage";
import { useNavigation } from "expo-router";

import useContent from "@/hook/useContent";
import { UserContext } from "@/context/userContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
	const source = axios.CancelToken.source();
	const navigator = useNavigation<any>();

	const content = useContent();

	const { lang } = useContext(UserContext);

	const [permission, requestPermission] = useCameraPermissions();

	const ref = useRef<CameraView>(null);

	const [imageUri, setImageUri] = useState<string | null>(null);
	const [cropType, setCropType] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const crop_types: { [key: string]: string } =
		content.cameraContent.cropNames;

	const requestStoragePermission = async () => {
		if (Platform.OS !== "web") {
			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== "granted") {
				alert(
					"Sorry, we need camera roll permissions to make this work!"
				);
			}
		}
	};

	const pickImage = async () => {
		await requestPermission();
		await requestStoragePermission();

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImageUri(result.assets[0].uri);

			const base64Image = await FileSystem.readAsStringAsync(
				result.assets[0].uri,
				{
					encoding: FileSystem.EncodingType.Base64,
				}
			);

			// Store the Base64 image
			await setItem("imageBase64", base64Image);
		}
	};

	async function takePicture() {
		const photo = await ref.current?.takePictureAsync({
			quality: 0.1,
		});

		if (photo) {
			setImageUri(photo.uri);
			// store the base64 image in the async storage

			const base64Image = await FileSystem.readAsStringAsync(photo.uri, {
				encoding: FileSystem.EncodingType.Base64,
			});

			// Store the Base64 image
			await setItem("imageBase64", base64Image);
		}
	}

	const analyzeImage = async () => {
		if (!imageUri) {
			return;
		}

		if (!cropType) {
			alert("Please select a crop type");
			return;
		}

		setLoading(true);

		const formData = new FormData();

		async function resizeImage(imageUri: any) {
			const manipResult = await ImageManipulator.manipulateAsync(
				imageUri,
				[{ resize: { width: 300 } }], // Resize to a smaller width
				{ compress: 0.4, format: ImageManipulator.SaveFormat.JPEG }
			);
			return manipResult.uri;
		}

		const resizedUri = await resizeImage(imageUri);

		formData.append("lang", lang || "en");
		formData.append("crop_type", cropType);

		formData.append("image", {
			uri: resizedUri,
			name: "image.jpg",
			type: "image/jpeg",
		} as any);

		// const image = await fetch(imageUri).then((res) => res.blob());
		// formData.append("image", image, "image.jpg");
		
		let url = "https://crop-disease-prediction-sih-backend.onrender.com";

		try{
			// await axios.get(url);
			// console.log("ngrok is running");

			// try to call the api, and set the timeout for the api call be 2 seconds, if it fails, then use the render url
			let response = await axios.get(url, {
				timeout: 2000,
			});

			console.log("render backend is running");
		}
		catch(error){
			console.log("render backend is not running");
			url = "https://excited-redbird-sought.ngrok-free.app";
		}

		try {
			console.log("starting the api call");
			console.log(`${url}/predict/`);

			let response = await axios.post(`${url}/predict/`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				cancelToken: source.token,
			});

			// console.log(response.data);

			setLoading(false);

			if (response.data.error) {
				alert(response.data.error);
				return;
			}

			await setItem("results", JSON.stringify(response.data));

			navigator.navigate("results/index");
		} catch (error: any) {
			if (error.response) {
				console.log("Server responded with:", error.response);
			} else {
				console.log("Error:", error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<SafeAreaView
				className="flex-1 justify-center items-center"
			>
				<View
					className="h-[40vh] w-[110vw] bg-[#208F4F] absolute top-0"
					style={{
						borderBottomLeftRadius: 100,
						borderBottomRightRadius: 100,
					}}
				></View>
				<Text
					style={styles.message}
					className="text-lg font-semibold px-20"
				>
					{content.cameraContent.permissionDescription}
				</Text>
				<Pressable
					onPress={requestPermission}
					className="bg-[#208F4F] py-2 px-4 rounded-xl"
				>
					<Text className="text-white text-xl">
						{content.cameraContent.permissionButtonText}
					</Text>
				</Pressable>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 justify-center items-center">
			<View
				className="h-[40vh] w-[110vw] bg-[#208F4F] absolute top-0"
				style={{
					borderBottomLeftRadius: 100,
					borderBottomRightRadius: 100,
				}}
			>
				<Pressable
					className="self-end bg-gray-500 rounded-xl p-2 m-8"
					onPress={() => {
						navigator.navigate("lang");
					}}
				>
					<Image
						source={require("@/assets/icons/lang.png")}
						className="w-6 h-6"
					/>
				</Pressable>
			</View>

			{imageUri === null && (
				<View className="mt-2">
					<View>
						<Text className="text-lg text-center font-bold p-8 text-white">
							{content.cameraContent.description}
						</Text>
					</View>
					<View className="justify-center items-center">
						<View style={styles.cameraContainer}>
							<CameraView
								style={styles.camera}
								facing={"back"}
								ref={ref}
							></CameraView>
						</View>

						<TouchableOpacity
							onPress={takePicture}
							className="mt-4"
						>
							<Image
								source={require("@/assets/icons/camera.png")}
								style={{ width: 75, height: 75 }}
							/>
						</TouchableOpacity>

						<Pressable className="bg-[#208F4F] py-2 px-4 rounded-xl mt-2">
							<Text
								onPress={pickImage}
								className="text-lg text-white"
							>
								{content.cameraContent.chooseImageText}
							</Text>
						</Pressable>
					</View>
				</View>
			)}

			{imageUri && (
				<>
					<View
						className="border-4 border-white rounded-xl overflow-hidden"
						style={{
							elevation: 10,
						}}
					>
						<Image
							source={{ uri: imageUri }}
							style={styles.imageStyles}
						/>
					</View>

					<Pressable
						onPress={() => {
							setImageUri(null);
							// Cancel the request
							source.cancel("Request cancelled by the user");
							setLoading(false);
							setCropType(null);
						}}
						className="bg-[#ff5555] py-2 px-4 rounded-xl mt-10"
					>
						<Text className="text-lg text-white text-center">
							{loading
								? content.cameraContent.cancelRequestText
								: content.cameraContent.removeImageText}
						</Text>
					</Pressable>

					<View className="overflow-hidden mt-4">
						<SelectDropdown
							data={Object.keys(crop_types)}
							onSelect={(selectedItem, index) => {
								setCropType(selectedItem);
							}}
							renderButton={(selectedItem, isOpened) => {
								return (
									<View style={styles.dropdownButtonStyle}>
										<Text className="text-white text-lg">
											{crop_types[selectedItem] ?? content.cameraContent.cropTypeText}
										</Text>
										<Image
											source={require("@/assets/icons/dropdown.png")}
											resizeMode="contain"
											style={{
												...styles.dropdownButtonArrowStyle,
												transform: [
													{
														rotate: isOpened
															? "180deg"
															: "0deg",
													},
												],
											}}
										/>
									</View>
								);
							}}
							renderItem={(item, index, isSelected) => {
								return (
									<View
										style={{
											...styles.dropdownItemStyle,
											...(isSelected && {
												backgroundColor: "#D2D9DF",
											}),
										}}
									>
										<Text
											style={styles.dropdownItemTxtStyle}
										>
											{crop_types[item]}
										</Text>
									</View>
								);
							}}
							showsVerticalScrollIndicator={true}
							dropdownStyle={styles.dropdownMenuStyle}
						/>
					</View>

					{cropType != null && (
						<Pressable
							onPress={() => {
								analyzeImage();
							}}
							className="bg-[#208F4F] min-w-[200px] py-2 px-4 rounded-xl mt-10 flex-row items-center justify-center"
						>
							{!loading && (
								<>
									<Text className="text-lg text-white text-center mr-5">
										{content.cameraContent.analyzeImageText}
									</Text>
									<Image
										source={require("@/assets/icons/analyze.png")}
										style={{ width: 30, height: 30 }}
										resizeMode="contain"
									/>
								</>
							)}
							{loading && (
								<ActivityIndicator
									color={"#fff"}
									size={"large"}
								/>
							)}
						</Pressable>
					)}
				</>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	message: {
		textAlign: "center",
		paddingBottom: 10,
	},
	cameraContainer: {
		justifyContent: "center",
		alignItems: "center",
		width: Math.min(
			Dimensions.get("window").width * 0.9,
			Dimensions.get("window").height * 0.6
		),
		height: Math.min(
			Dimensions.get("window").width * 0.9,
			Dimensions.get("window").height * 0.6
		),
		borderRadius: Math.min(
			Dimensions.get("window").width * 0.9,
			Dimensions.get("window").height * 0.6
		),
		overflow: "hidden",
		borderWidth: 4,
		// borderColor: "#208F4F",
		borderColor: "white",
		elevation: 10,
	},
	camera: {
		width: Math.min(
			Dimensions.get("window").width * 0.9,
			Dimensions.get("window").height * 0.6
		),
		height: Math.min(
			Dimensions.get("window").width * 0.9,
			Dimensions.get("window").height * 0.6
		),
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
	},
	imageStyles: {
		width: Math.min(
			Dimensions.get("window").width * 0.9,
			Dimensions.get("window").height * 0.6
		),
		height: Math.min(
			Dimensions.get("window").width * 0.9,
			Dimensions.get("window").height * 0.6
		),
	},
	dropdownButtonStyle: {
		width: 200,
		backgroundColor: "#208F4F",
		borderRadius: 12,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 8,
	},
	dropdownButtonArrowStyle: {
		width: 16,
		height: 16,
	},
	dropdownMenuStyle: {
		backgroundColor: "#E9ECEF",
		borderRadius: 8,
		transform: [{ translateY: -40 }],
		height: 150,
	},
	dropdownItemStyle: {
		// width: "100%",
		flexDirection: "row",
		paddingHorizontal: 12,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 8,
	},
	dropdownItemTxtStyle: {
		// flex: 1,
		color: "#151E26",
	},
	dropdownItemIconStyle: {
		fontSize: 28,
		marginRight: 8,
	},
});
