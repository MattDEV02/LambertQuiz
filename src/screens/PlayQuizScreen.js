import React from "react";
import {
	View,
	Text,
	SafeAreaView,
	StatusBar,
	TouchableOpacity,
} from "react-native";
import { COLORS, appName } from "../constants/theme";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FlatList } from "react-native-gesture-handler";
import FormButton from "../components/shared/FormButton";

// TODO: QUESTION COMPONENT.

const PlayQuizScreen = () => {
	const getOptionBgColor = (currentQuestion, currentOption) => {
		if (currentQuestion.selectedOption) {
			if (currentOption == currentQuestion.selectedOption)
				return COLORS.success;
			else return COLORS.error;
		} else return COLORS.white;
	};

	const getOptionTextColor = (currentQuestion, currentOption) => {
		if (currentQuestion.selectedOption) {
			if (currentOption == currentQuestion.selectedOption)
				return COLORS.white;
			else return COLORS.black;
		} else return COLORS.black;
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
				position: "relative",
			}}
		>
			<StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
			{/* TOP BAR */}
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					paddingVertical: 10,
					paddingHorizontal: 20,
					backgroundColor: COLORS.white,
					elevation: 4,
				}}
			>
				{/* TITLE */}
				<Text style={{ fontSize: 16, marginLeft: 10 }}>{appName}</Text>
				{/* Corret and Incorrect */}
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{/* Correct */}
					<View
						style={{
							backgroundColor: COLORS.success,
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							paddingHorizontal: 10,
							paddingVertical: 4,
							borderTopLeftRadius: 10,
							borderBottomLeftRadius: 10,
						}}
					>
						<MaterialIcons
							name="check"
							size={14}
							style={{ color: COLORS.white }}
						/>
						{/* correct count */}
						<Text style={{ color: COLORS.white, marginLeft: 6 }}>1</Text>
					</View>
					{/* Correct */}
					<View
						style={{
							backgroundColor: COLORS.error,
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							paddingHorizontal: 10,
							paddingVertical: 4,
							borderTopRightRadius: 10,
							borderBottomRightRadius: 10,
						}}
					>
						<MaterialIcons
							name="close"
							size={14}
							style={{ color: COLORS.white }}
						/>
						{/* correct count */}
						<Text style={{ color: COLORS.white, marginLeft: 6 }}>1</Text>
					</View>
				</View>
			</View>
			{/* Questions and Options */}
			<FlatList
				data={[]}
				style={{ flex: 1, backgroundColor: COLORS.background }}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item) => item.question}
				renderItem={({ item, index }) => (
					<View style={{ marginTop: 14, marginHorizontal: 10 }}>
						<View style={{ padding: 20 }}>
							<Text>1 {item.question}</Text>
							{item.imageUrl != "" ? (
								<Image
									source={{ uri: item.imageUrl }}
									resizeMode={"contain"}
									style={{
										width: "80%",
										height: 150,
										marginTop: 20,
										marginLeft: "10%",
										borderRadius: 5,
									}}
								/>
							) : null}
						</View>
						{/* Options */}
						{item.allOptions.map((option, optionIndex) => {
							return (
								<TouchableOpacity
									key={optionIndex}
									style={{
										paddingVertical: 15,
										paddingHorizontal: 20,
										borderTopWidth: 1,
										backgroundColor: getOptionBgColor(item, option),
										borderColor: COLORS.border,
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "flex-start",
									}}
									onPress={() => {
										if (item.selectedOption) {
											return null;
										}
										// increase correct and incorrect count
										if (option == item.correct_answer) {
										} else {
										}
									}}
								>
									<Text
										style={{
											width: 25,
											height: 25,
											padding: 2,
											borderWidth: 1,
											borderColor: COLORS.border,
											textAlign: "center",
											marginLeft: 15,
											borderRadius: 25,
											color: getOptionTextColor(item, option),
										}}
									>
										{optionIndex + 1}
									</Text>
									<Text
										style={{
											color: getOptionTextColor(item, option),
										}}
									>
										{option}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				)}
				ListFooterComponent={() => {
					<FormButton
						labelText="Submit"
						style={{ margin: 10 }}
						handleOnPress={() => {
							// show result modal
						}}
					></FormButton>;
				}}
			/>
		</SafeAreaView>
	);
};

export default PlayQuizScreen;
