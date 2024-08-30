import { Href, Link } from "expo-router";
import {
	Image,
	ImageSourcePropType,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

type props = {
	icon?: ImageSourcePropType | undefined;
	placeholder: string;
	link?: string;
	name?: string;
	style?: object;
	onChangeText?: (text: string, name?: string) => void;
	value?: string | number;
};

const Input = ({
	icon,
	placeholder,
	link,
	style,
	name,
	onChangeText,
	value,
}: props) => {
	return (
		<View style={[styles.inputContainer, style]}>
			<Image
				source={icon}
				style={styles.inputIcon}
				resizeMode="contain"
			/>
			<TextInput
				placeholder={placeholder}
				style={styles.inputField}
				selectionColor={"#D5715B"}
				secureTextEntry={placeholder === "Password"}
				value={value}
				onChangeText={(e: any) => {
					console.log(e);
					if (name) {
						onChangeText!(e, name as string);
					} else {
						onChangeText!(e);
					}
				}}
			/>

			{link && (
				<Link href={link as Href<string | object>}>
					<Text style={styles.forgotPassword}>Forgot?</Text>
				</Link>
			)}
		</View>
	);
};

export default Input;

const styles = StyleSheet.create({
	inputFieldsContainer: {
		marginBottom: 40,
		gap: 20,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#EFEDED",
		gap: 10,
		padding: 10,
		borderRadius: 10,
	},
	inputIcon: {
		width: 20,
		height: 20,
	},
	inputField: {
		flex: 1,
	},
	forgotPassword: {
		color: "#D5715B",
		marginLeft: "auto",
	},
});
