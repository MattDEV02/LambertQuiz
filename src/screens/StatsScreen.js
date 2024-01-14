import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	RefreshControl,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import { supabase } from "../app/lib/supabase-client";
import StatsTable from "../components/screens/StatsScreen/StatsTable";
import StatsCalendar from "../components/screens/StatsScreen/StatsCalendar";
import ChartsPicker from "../components/screens/StatsScreen/ChartsPicker";
import {
	StatsBarChart,
	StatsLineChart,
	StatsPieChart,
	StatsHorizontalBarChart,
} from "../components/screens/StatsScreen/charts/";
import StatsFooter from "../components/screens/StatsScreen/StatsFooter";
import {
	validateObject,
	validateArray,
	validateString,
} from "../utils/validators";
import { appName, CHARTTYPES } from "../constants/theme";

const StatsScreen = ({ route }) => {
	const isFocused = useIsFocused();

	const user = route.params.user;
	const userId = user.user_id;

	const userSub = moment(user.email_confirmed_at).format("DD/MM/YYYY"),
		userUpd = moment(user.updated_at).format("YYYY-MM-DD");
	const userSubDays = moment().diff(user.email_confirmed_at, "days") + 1;

	const [bestFiveUsersMatrix, setBestFiveUsersMatrix] = useState([]); // array of arrays
	const [quizzesDays, setQuizzesDays] = useState([]); // array of objects
	const [userLastSevenDaysQuizzes, setUserLastSevenDaysQuizzes] = useState([]); // array of objects
	const [userPrefCategory, setUserPrefCategory] = useState("");
	const [refreshing, setRefreshing] = useState(false);
	const [selectedChart, setSelectedChart] = useState(CHARTTYPES.barChart);

	const getBestFiveUsersStats = async () => {
		setRefreshing(true);
		const { data, error } = await supabase.rpc("get_best_five_users_stats");
		if (validateObject(error)) {
			console.error(error);
		} else if (validateArray(data, 0)) {
			setBestFiveUsersMatrix(toMatrix(data));
		}
		setRefreshing(false);
	};

	const getQuizzesDays = async (_user_id) => {
		setRefreshing(true);
		const { data, error } = await supabase.rpc("get_quizzes_days", {
			_user_id,
		});
		if (validateObject(error)) {
			console.error(error);
		} else if (validateArray(data, 0)) {
			setQuizzesDays(data);
		}
		setRefreshing(false);
	};

	const getUserLastSevenDaysQuizzes = async (_user_id) => {
		setRefreshing(true);
		const { data, error } = await supabase.rpc(
			"get_last_seven_days_quizzes",
			{
				_user_id,
			},
		);
		if (validateObject(error)) {
			console.error(error);
		} else if (validateArray(data, 7)) {
			let tempUserLastSevenDaysQuizzes = [];
			data.map((item) => {
				tempUserLastSevenDaysQuizzes.push({
					label: item.day,
					value: item.totalquizzes,
					text: item.day,
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

	const onRefresh = () => {
		getBestFiveUsersStats();
		getQuizzesDays(userId);
		getUserLastSevenDaysQuizzes(userId);
		getUserPrefCategory(userId);
	};

	useEffect(() => {
		if (isFocused) {
			onRefresh();
		}
	}, [isFocused]);

	const toMatrix = (objectsArray) => {
		const matrix = [];
		const arrayLength = objectsArray.length;
		for (let i = 0; i < arrayLength; i++) {
			const row = [
				objectsArray[i].username,
				objectsArray[i].averagescore,
				objectsArray[i].worstscore,
				objectsArray[i].betterscore,
				objectsArray[i].totalquizzes,
				objectsArray[i].quizzescompletitionpercentage,
			];
			matrix.push(row); 
		}
		return matrix;
	};

	return (
		<SafeAreaView>
			<View>
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
				>
					<View>
						<Text style={{ ...style.text, ...style.title }}>
							Best 5 {appName} Players
						</Text>
						{validateArray(bestFiveUsersMatrix, 0) ? (
							<StatsTable matrix={bestFiveUsersMatrix} />
						) : null}
					</View>
					<View>
						<Text style={{ ...style.text, ...style.title }}>
							Your {appName} activity
						</Text>
						{validateArray(quizzesDays, 0) ? (
							<StatsCalendar
								data={quizzesDays}
								userSubDate={moment(user.email_confirmed_at).format(
									"YYYY-MM-DD",
								)}
								userUpdatedDate={userUpd}
							/>
						) : null}
					</View>
					<View>
						<Text style={{ ...style.text, ...style.title }}>
							Last seven days quizzes
						</Text>
						<ChartsPicker setSelectedChart={setSelectedChart} />
						{validateArray(userLastSevenDaysQuizzes, 7) ? (
							<View>
								{selectedChart === CHARTTYPES.barChart ? (
									<StatsBarChart data={userLastSevenDaysQuizzes} />
								) : selectedChart === CHARTTYPES.lineChart ? (
									<StatsLineChart data={userLastSevenDaysQuizzes} />
								) : selectedChart === CHARTTYPES.horizontalBarChart ? (
									<StatsHorizontalBarChart
										data={userLastSevenDaysQuizzes}
									/>
								) : selectedChart === CHARTTYPES.pieChart ? (
									<StatsPieChart data={userLastSevenDaysQuizzes} />
								) : (
									<StatsBarChart data={userLastSevenDaysQuizzes} />
								)}
							</View>
						) : null}
					</View>
					{validateString(userSub) && userSubDays >= 1 ? (
						<StatsFooter
							userSub={userSub}
							userSubDays={userSubDays}
							userPrefCategory={userPrefCategory}
						/>
					) : null}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

const style = StyleSheet.create({
	text: { margin: 3.5, textAlign: "center", fontWeight: "bold" },
	title: {
		fontSize: 24,
		marginVertical: 27,
	},
});

export default StatsScreen;
