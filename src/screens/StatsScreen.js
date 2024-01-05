import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SafeAreaView,
	ScrollView,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import moment from "moment";
import { supabase } from "../app/lib/supabase-client";
import StatsTable from "../components/screens/StatsScreen/StatsTable";
import ChartsPicker from "../components/screens/StatsScreen/ChartsPicker";
import {
	StatsBarChart,
	StatsLineChart,
	StatsPieChart,
} from "../components/screens/StatsScreen/charts/";
import StatsFooter from "../components/screens/StatsScreen/StatsFooter";
import {
	validateObject,
	validateArray,
	validateString,
} from "../utils/validators";
import { COLORS } from "../constants/theme";

const StatsScreen = ({ route }) => {
	const user = route.params.user;
	const userId = user.user_id;

	const CHARTTYPES = {
		barChart: "BarChart",
		lineChart: "LineChart",
		pieChart: "PieChart",
	};

	const userSub = moment(user.confirmed_at).format("DD/MM/YYYY");
	const userSubDays = moment().diff(user.confirmed_at, "days") + 1;

	const [bestFiveUsersMatrix, setBestFiveUsersMatrix] = useState([]); // array of arrays
	const [userLastSevenDaysQuizzes, setUserLastSevenDaysQuizzes] = useState([]); // array of objects
	const [userPrefCategory, setUserPrefCategory] = useState("");
	const [refreshing, setRefreshing] = useState(false);

	const [selectedChart, setSelectedChart] = useState(CHARTTYPES.barChart);

	useEffect(() => {
		const getBestFiveUsersStats = async () => {
			setRefreshing(true);
			const { data, error } = await supabase.rpc(
				"get_best_five_users_stats",
			);
			if (validateObject(error)) {
				console.error(error);
			} else if (validateArray(data, 0)) {
				setBestFiveUsersMatrix(toMatrix(data));
			}
			setRefreshing(false);
		};

		const getUserLastSevenDaysQuizzes = async (_user_id) => {
			setRefreshing(true);
			const { data, error } = await supabase.rpc(
				"get_last_seven_days_quizzes",
				{
					_user_id: _user_id,
				},
			);
			if (validateObject(error)) {
				console.error(error);
			} else if (validateArray(data, 7)) {
				let tempUserLastSevenDaysQuizzes = [];
				data.map((item) => {
					const formattedDate = moment(item.day).format("DD/MM");
					tempUserLastSevenDaysQuizzes.push({
						label: formattedDate,
						value: item.totalquizzes,
						text: formattedDate,
					});
				});
				setUserLastSevenDaysQuizzes(tempUserLastSevenDaysQuizzes);
			}
			setRefreshing(false);
		};

		const getUserPrefCategory = async (_user_id) => {
			setRefreshing(true);
			const { data, error } = await supabase
				.rpc("get_user_pref_category", {
					_user_id: _user_id,
				})
				.single();
			if (validateObject(error) && data !== null) {
				console.error(error);
			} else if (validateObject(data) && validateString(data.category)) {
				setUserPrefCategory(data.category);
			}
			setRefreshing(false);
		};

		getBestFiveUsersStats();
		getUserLastSevenDaysQuizzes(userId);
		getUserPrefCategory(userId);
	}, []);

	const goodMathRound = number => {
		number = parseFloat(number);
		const integerNumber = Math.round(number);
		if(number - integerNumber == 0) {
			return integerNumber;
		} 
		return number;
	};

	const toMatrix = (objectsArray) => {
		const matrix = [];
		const arrayLength = objectsArray.length;
		for (let i = 0; i < arrayLength; i++) {
			const row = [
				objectsArray[i].username,
				objectsArray[i].averagescore,
				objectsArray[i].totalscore,
				objectsArray[i].betterscore,
				objectsArray[i].totalquizzes,
				objectsArray[i].quizzescompletitionpercentage,
			];
			for (i = 0; i < 5; i++) matrix.push(row); //
		}
		return matrix;
	};

	return (
		<SafeAreaView>
			<View>
				<ScrollView>
					{validateArray(bestFiveUsersMatrix, 0) ? (
						<StatsTable matrix={bestFiveUsersMatrix} />
					) : null}
					<ActivityIndicator
						size="large"
						color={COLORS.black}
						animating={refreshing}
					/>
					<ChartsPicker
						chartsToSelect={CHARTTYPES}
						setSelectedChart={setSelectedChart}
					/>
					{validateArray(userLastSevenDaysQuizzes, 7) ? (
						<View>
							{selectedChart === "BarChart" ? (
								<StatsBarChart data={userLastSevenDaysQuizzes} />
							) : selectedChart === "LineChart" ? (
								<StatsLineChart data={userLastSevenDaysQuizzes} />
							) : selectedChart === "PieChart" ? (
								<StatsPieChart data={userLastSevenDaysQuizzes} />
							) : (
								<StatsBarChart data={userLastSevenDaysQuizzes} />
							)}
						</View>
					) : null}
					{validateString(userSub) ? (
						<StatsFooter
							userSub={userSub}
							userSubDays={userSubDays}
							userPrefCategory={userPrefCategory}
							addingTextStyle={style.text}
						/>
					) : null}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

const style = StyleSheet.create({
	text: { margin: 3.5, textAlign: "center", fontWeight: "bold" },
});

export default StatsScreen;
