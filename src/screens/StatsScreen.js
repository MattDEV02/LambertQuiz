import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SafeAreaView,
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
import {
	validateObject,
	validateArray,
	validateString,
} from "../utils/validators";
import { COLORS } from "../constants/theme";

const StatsScreen = ({ navigation, route }) => {
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
						fontWeight: "bold"
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

	const toMatrix = (objectsArray) => {
		const matrix = [];
		const arrayLength = objectsArray.length;
		for (let i = 0; i < arrayLength; i++) {
			const row = [
				objectsArray[i].username,
				objectsArray[i].averagescore,
				objectsArray[i].betterscore,
				objectsArray[i].quizzescompletitionpercentage,
				objectsArray[i].totalquizzes,
				objectsArray[i].totalscore,
			];
			for (i = 0; i < 5; i++) matrix.push(row); //
		}
		return matrix;
	};

	return (
		<SafeAreaView>
			<View>
				{validateArray(bestFiveUsersMatrix, 0) ? (
					<StatsTable matrix={bestFiveUsersMatrix} />
				) : null}
				<ActivityIndicator
					size="large"
					color={COLORS.primary}
					animating={refreshing}
				/>
				<ChartsPicker chartsToSelect={CHARTTYPES} setSelectedChart={setSelectedChart} />
				{validateArray(userLastSevenDaysQuizzes, 7) ? (
					<View>
						{selectedChart === "BarChart" ? (
							<StatsBarChart data={userLastSevenDaysQuizzes} />
						) : selectedChart === "LineChart" ? (
							<StatsLineChart data={userLastSevenDaysQuizzes} />
						) : (
							<StatsPieChart data={userLastSevenDaysQuizzes} />
						)}
					</View>
				) : null}
				{validateString(userSub) ? (
					<View style={style.footer}>
						<Text style={{ ...style.text, ...style.footerText }}>
							You are our User since {userSub}, that's {userSubDays}{" "}
							days!
						</Text>
						<Text style={{ ...style.text, ...style.footerText }}>
							Prefered category:{" "}
							{validateString(userPrefCategory)
								? userPrefCategory
								: "None"}
						</Text>
					</View>
				) : null}
			</View>
		</SafeAreaView>
	);
};

const style = StyleSheet.create({
	text: { margin: 3.5, textAlign: "center", fontWeight: "bold" },
	footer: { marginVertical: 10 },
	footerText: { fontSize: 16 },
});

export default StatsScreen;
