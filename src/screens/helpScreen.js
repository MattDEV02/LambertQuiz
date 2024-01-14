import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import AccordionItem from "../components/screens/HelpScreen/AccordionItem";
import HelpFooter from "../components/screens/HelpScreen/HelpFooter";
import { appName, questionsNumber } from "../constants/theme";
import { passwordMaxLength } from "../constants/fieldsConstants";

const HelpScreen = () => {
	const accordionList = [
		{
			question: `How to play at LambertQuiz?`,
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
			response: `Now the App has 6 categories.`,
		},
		{
			question: `How many questions has a Quiz?`,
			response: `You have 50 seconds, 10 seconds per question!`,
		},
		{
			question: `How long do I have to take a quiz?`,
			response: `Now the App has 6 categories.`,
		},
		{
			question: `How should my password be made?`,
			response: `Your ${appName} password must have ${passwordMaxLength} characters, lowercase, uppercase and numbers.`,
		},
		{
			question: `Where can I read the results and statistics I have made in this game?`,
			response: `Simple, on the statistics page!`,
		},
		{
			question: `Where can I see my profile in this App?`,
			response: `Simple, on the profile page!`,
		},
		{
			question: `What happens if I abandon a quiz in progress?`,
			response: `Luckily for you, nothing happens!`,
		},
		{
			question: `What can I see on the statistics page?`,
			response: `First of all, you can look at a table that shows various static data of the top 5 players of this app, a calendar that shows your activity on this app, graphs that show the number of quizzes taken in the last week (day by day), favorite quiz category and much more!`,
		},
		{
			question: `Who is the Author of this beatiful App?`,
			response: `He is Lambertucci Matteo!`,
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
				<HelpFooter />
			</ScrollView>
		</SafeAreaView>
	);
};

export default HelpScreen;
