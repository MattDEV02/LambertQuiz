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
import Offline from "../components/shared/Offline";
import {
	validateObject,
	validateArray,
	validateString,
	validateInteger,
} from "../utils/validators";
import { appName, CHARTTYPES } from "../constants/theme";

const StatsScreen = ({ route }) => {
	const isFocused = useIsFocused();

	const user = route.params.user;
	
	const userId = user.user_id;

	const userSub = moment(user.email_confirmed_at).format("DD/MM/YYYY");
	const userSubDays = moment().diff(user.email_confirmed_at, "days") + 1;

	const [userUpdatedDate, setUserUpdatedDate] = useState("");
	const [bestFiveUsersMatrix, setBestFiveUsersMatrix] = useState([]); // array of arrays
	const [quizzesDays, setQuizzesDays] = useState([]); // array of objects
	const [userLastSevenDaysQuizzes, setUserLastSevenDaysQuizzes] = useState([]); // array of objects
	const [userPrefCategory, setUserPrefCategory] = useState("");
	const [refreshing, setRefreshing] = useState(false);
	const [selectedChart, setSelectedChart] = useState(CHARTTYPES.barChart);
	const [offline, setOffline] = useState(false);

	const getUserUpdateDate = async (user_id) => {
		setRefreshing(true);
		const { data, error } = await supabase
			.from("users")
			.select("updated_at")
			.eq("user_id", user_id)
			.single();
		if (validateObject(error)) {
			console.error(error);
			setOffline(true);
		} else if (validateObject(data) && validateString(data.updated_at)) {
			setUserUpdatedDate(data.updated_at);
			setOffline(false);
		}
		setRefreshing(false);
	};

	const getBestFiveUsersStats = async () => {
		setRefreshing(true);
		const { data, error } = await supabase.rpc("get_best_five_users_stats");
		if (validateObject(error)) {
			console.error(error);
			setOffline(true);
		} else if (validateArray(data, 0)) {
			setBestFiveUsersMatrix(toMatrix(data));
			setOffline(false);
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
			setOffline(true);
		} else if (validateArray(data, 0)) {
			setQuizzesDays(data);
			setOffline(false);
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
			setOffline(true);
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
			setOffline(false);
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
			setOffline(true);
		} else if (validateObject(data) && validateString(data.category)) {
			setUserPrefCategory(data.category);
			setOffline(false);
		}
		setRefreshing(false);
	};

	const onRefresh = () => {
		getUserUpdateDate(user.user_id);
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
		let matrix = [];
		const arrayLength = objectsArray.length;
		for (let i = 0; i < arrayLength; i++) {
			const row = [
				i + 1,
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
					{offline ? (
						<Offline />
					) : (
						<View>
							<View>
								<Text style={{ ...styles.text, ...styles.title }}>
									Best 5 {appName} Players
								</Text>
								{validateArray(bestFiveUsersMatrix, 0) ? (
									<StatsTable matrix={bestFiveUsersMatrix} />
								) : null}
							</View>
							<View>
								<Text style={{ ...styles.text, ...styles.title }}>
									Your {appName} activity
								</Text>
								{validateArray(quizzesDays, 0) &&
								validateString(userUpdatedDate) ? (
									<StatsCalendar
										data={quizzesDays}
										user={user}
										userUpdatedDate={userUpdatedDate}
									/>
								) : null}
							</View>
							<View>
								<Text style={{ ...styles.text, ...styles.title }}>
									Last seven days quizzes
								</Text>
								<ChartsPicker setSelectedChart={setSelectedChart} />
								{validateArray(userLastSevenDaysQuizzes, 7) ? (
									<View>
										{selectedChart === CHARTTYPES.barChart ? (
											<StatsBarChart
												data={userLastSevenDaysQuizzes}
											/>
										) : selectedChart === CHARTTYPES.lineChart ? (
											<StatsLineChart
												data={userLastSevenDaysQuizzes}
											/>
										) : selectedChart ===
										  CHARTTYPES.horizontalBarChart ? (
											<StatsHorizontalBarChart
												data={userLastSevenDaysQuizzes}
											/>
										) : selectedChart === CHARTTYPES.pieChart ? (
											<StatsPieChart
												data={userLastSevenDaysQuizzes}
											/>
										) : (
											<StatsBarChart
												data={userLastSevenDaysQuizzes}
											/>
										)}
									</View>
								) : null}
							</View>
							{validateString(userSub) &&
							validateInteger(userSubDays, 1) ? (
								<StatsFooter
									userSub={userSub}
									userSubDays={userSubDays}
									userPrefCategory={userPrefCategory}
								/>
							) : null}
						</View>
					)}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	text: { margin: 3.5, textAlign: "center", fontWeight: "bold" },
	title: {
		fontSize: 24,
		marginVertical: 27,
	},
});

export default StatsScreen;
