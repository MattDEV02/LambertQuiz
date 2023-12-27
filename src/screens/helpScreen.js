import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import AccordionItem from "../components/screens/HelpScreen/AccordionItem";
import { COLORS, questionsNumber } from "../constants/theme";

const HelpScreen = () => {
	const accordionList = [
		{
			question: `How to play at LambertQuiz ?`,
			response: `It's very easy to play the LambertQuiz game, in fact as soon as you log in you can choose a quiz category, play, send the result and see your score (and the sounds)!`,
		},
		{
			question: `Is it possible to play online with a my friend?`,
			response: `Unfortunately no, currently it is not possible to play online with your friends but don't despair that it will be possible in the future!`,
		},
		{
			question: `Is it possible to play in offline-mode?`,
			response: `Unfortunately no, currently it is not possible to play in offlide-mode but don't despair that it will be possible in the future!`,
		},
		{
			question: `How can I delete my account?`,
			response: `First of all, we are sorry that you want to delete your account. To delete your account you need to go to Account -> Delete Account.`,
		},
		{
			question: `How many categories has the App?`,
			response: `Now the App has 3 categories.`,
		},
		{
			question: `How many questions has a Quiz?`,
			response: `Any Quiz category has ${questionsNumber} questions.`,
		},
		{
			question: `Where can I read the results and statistics I have made in this game?`,
			response: `Simple, on the statistics page !`,
		},
		{
			question: `Where can I see my profile in this App?`,
			response: `Simple, on the profile page !`,
		},
		{
			question: `Who is the Author of this App?`,
			response: `He is Lambertucci Matteo !`,
		},
	];
	return (
		<SafeAreaView>
			<ScrollView>
				{accordionList.map((item, index) => (
					<AccordionItem
						question={item.question}
						response={item.response}
						key={index}
					/>
				))}
				<View
					style={{
						paddingHorizontal: 20,
						paddingBottom: 27,
						marginTop: 24,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<View>
						<Text style={{ fontSize: 15, color: COLORS.primary }}>
							For any problems encountered, contact the development
							center at mattoelambertucci3@gmail.com
						</Text>
						<Text style={{ color: COLORS.primary, marginTop: 5 }}>
							Copyright @ 2024 Lambertucci Matteo.
						</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default HelpScreen;
