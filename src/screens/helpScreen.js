import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import AccordionItem from "../components/HelpScreen/AccordionItem";
import { COLORS } from "../constants/theme";

const HelpScreen = ({ navigation }) => {
	const accordionList = [
		{
			question: `How to play at LambertQuiz ?`,
			response: `It's very easy to play the LambertQuiz game, in fact as soon as you log in you can choose a quiz category, play, send the result and see your score!`,
		},
		{
			question: `Is it possible to play online with a my friend?`,
			response: `Unfortunately no, currently it is not possible to play online with your friends but don't despair that it will be possible in the future!`,
		},
		{
			question: `How can I delete my account?`,
			response: `First of all, we are sorry that you want to delete your account. To delete your account you need to go to Account -> Delete Account.`,
		},
		{
			question: `How many questions has a Quiz?`,
			response: `Any Quiz category has 5 questions.`,
		},
	];
	return (
		<SafeAreaView>
			<View>
				{accordionList.map((item) => (
					<AccordionItem
						question={item.question}
						response={item.response}
					/>
				))}
				<View
					style={{
						paddingHorizontal: 30,
						marginTop: 24,
					}}
				>
					<Text style={{ fontSize: 15, color: COLORS.primary }}>
						For any problems encountered, contact the development center
						at mattoelambertucci3@gmail.com
					</Text>
					<Text style={{ color: COLORS.primary, marginTop: 5 }}>
						Copyright @ 2024 Lambertucci Matteo.
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default HelpScreen;
