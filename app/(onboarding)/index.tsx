import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import { useRef, useState } from "react";
import JoinButton from "@/components/joinButton";

import { Swipeable } from "react-native-gesture-handler";

import { useNavigation } from "expo-router";
import useContent from "@/hook/useContent";
import { setItem } from "@/common/storage";

export default function index() {
	const navigator = useNavigation<any>();

	const content = useContent();

	const images = [
		require("@/assets/onboarding-images/1.png"),
		require("@/assets/onboarding-images/2.png"),
		require("@/assets/onboarding-images/3.png"),
	];
	const titles = content.onboardingData.titles;
	const texts = content.onboardingData.texts;

	const [index, setIndex] = useState(0);
	const [prevIndex, setPrevIndex] = useState(0);
	const [reverseAnimationDirection, setReverseAnimationDirection] =
		useState(false);
	const [leftSwipe, setLeftSwipe] = useState(false);

	const anim = useRef(new Animated.Value(1)).current;
	const paginationAnim = useRef(new Animated.Value(1)).current;

	const paginationAnimStart = () => {
		paginationAnim.setValue(0);
		Animated.timing(paginationAnim, {
			toValue: 1,
			duration: 500,
			useNativeDriver: false,
		}).start();
	};

	const handleSwipe = (e?: any) => {
		// if left swipe occurs, reverseAnimationDirection the animation
		if (e?.nativeEvent.translationX > 0) {
			setLeftSwipe(true);

			setReverseAnimationDirection(false);
			anim.setValue(0);
			Animated.timing(anim, {
				toValue: 1,
				duration: 500,
				useNativeDriver: false,
			}).start(() => {
				setReverseAnimationDirection(true);
				setPrevIndex(index);
				setIndex(index === 0 ? images.length - 1 : index - 1);

				paginationAnimStart();

				Animated.timing(anim, {
					toValue: 0,
					duration: 500,
					useNativeDriver: false,
				}).start(() => {
					setLeftSwipe(false);
					anim.setValue(1);
				});
			});
			return;
		}

		setReverseAnimationDirection(true);
		Animated.timing(anim, {
			toValue: 0,
			duration: 500,
			useNativeDriver: false,
		}).start(() => {
			setReverseAnimationDirection(false);
			setPrevIndex(index);
			setIndex((index + 1) % images.length);

			paginationAnimStart();

			Animated.timing(anim, {
				toValue: 1,
				duration: 500,
				useNativeDriver: false,
			}).start();
		});
	};

	const fadeTranslateAnim = {
		opacity: leftSwipe
			? anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
			: anim,
		transform: [
			{
				translateX: anim.interpolate({
					inputRange: [0, 1],
					outputRange: leftSwipe
						? [0, reverseAnimationDirection ? -150 : 150]
						: [reverseAnimationDirection ? -150 : 150, 0],
				}),
			},
		],
	};

	const fadeAnim = {
		opacity: leftSwipe
			? anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
			: anim,
	};

	const paginationWidthAnim = (i: number) => {
		let lowerLimit = 10;
		let upperLimit = 10;

		if (i === index) {
			upperLimit = 25;
		} else if (i === prevIndex) {
			lowerLimit = 25;
		}

		return {
			width: paginationAnim.interpolate({
				inputRange: [0, 1],
				outputRange: [lowerLimit, upperLimit],
			}),
		};
	};

	return (
		<View style={{ ...styles.container, backgroundColor: "#208F4F" }}>
			<Animated.View style={[styles.imageContainer, fadeAnim]}>
				<Swipeable onEnded={handleSwipe}>
					<Animated.Image
						source={images[index]}
						style={styles.image}
					/>
				</Swipeable>
			</Animated.View>

			<View style={styles.contentContainer}>
				<Swipeable onEnded={handleSwipe}>
					<Animated.Text style={[styles.title, fadeTranslateAnim]}>
						{titles[index]}
					</Animated.Text>

					<Animated.Text style={[styles.text, fadeTranslateAnim]}>
						{texts[index]}
					</Animated.Text>

					<View style={styles.pagination}>
						{titles.map((_, i) => {
							return (
								<Animated.View
									key={i}
									style={[
										styles.paginationIcon,
										paginationWidthAnim(i),
									]}
								></Animated.View>
							);
						})}
					</View>
				</Swipeable>

				<View style={styles.buttonContainer}>
					<JoinButton
						onPress={async () => {
							navigator.navigate("(tabs)");
							await setItem("onboarded", true);
						}}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	imageContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		width: Dimensions.get("window").width,
		height: "100%",
	},
	contentContainer: {
		flex: 1,
		justifyContent: "space-evenly",
		alignItems: "center",
		backgroundColor: "#fff",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 30,
	},
	text: {
		fontSize: 16,
		textAlign: "center",
		marginHorizontal: 30,
		marginBottom: 50,
	},
	pagination: {
		flexDirection: "row",
		justifyContent: "center",
	},
	paginationIcon: {
		height: 10,
		backgroundColor: "#000",
		borderRadius: 10,
		marginHorizontal: 5,
	},
	buttonContainer: {
		paddingHorizontal: 30,
		alignItems: "center",
	},
	loginButton: {
		borderBottomWidth: 1,
		fontSize: 16,
	},
});
