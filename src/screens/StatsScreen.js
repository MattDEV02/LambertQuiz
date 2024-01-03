import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SafeAreaView,
	InputScrollView,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import moment from "moment";
import { supabase } from "../app/lib/supabase-client";
import StatsTable from "../components/screens/StatsScreen/StatsTable";
import StatsBarChart from "../components/screens/StatsScreen/charts/StatsBarChart";
import StatsLineChart from "../components/screens/StatsScreen/charts/StatsLineChart";
import StatsPieChart from "../components/screens/StatsScreen/charts/StatsPieChart";
import {
	validateObject,
	validateArray,
	validateString,
} from "../utils/validators";
import { COLORS } from "../constants/theme";

const StatsScreen = ({ navigation, route }) => {
	const user = route.params.user;
	const userId = user.user_id;

	const userSub = moment(user.confirmed_at).format("DD/MM/YYYY");
	const userSubDays = moment().diff(user.confirmed_at, "days") + 1;

	const [bestFiveUsersMatrix, setBestFiveUsersMatrix] = useState([]); // array of arrays
	const [userLastSevenQuizzes, setUserLastSevenQuizzes] = useState([]); // array of objects
	const [userPrefCategory, setUserPrefCategory] = useState("");
	const [refreshing, setRefreshing] = useState(false);

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
				//console.log(data);
				let a = [];
				data.map((item) => {
					a.push({
						label: moment(item.day).format("DD/MM"),
						value: item.totalquizzes,
					});
				});
				setUserLastSevenQuizzes(a);
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
				console.log(data);
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
				<ActivityIndicator
					size="large"
					color={COLORS.primary}
					animating={refreshing}
				/>
				{validateArray(bestFiveUsersMatrix, 0) ? (
					<StatsTable matrix={bestFiveUsersMatrix} />
				) : null}
				{validateArray(userLastSevenQuizzes, 7) ? (
					<StatsPieChart data={userLastSevenQuizzes} style={style.chart} />
				) : null}
				{validateString(userSub) ? (
					<View>
						<Text style={style.text}>
							You are our User since {userSub}, that's {userSubDays}{" "}
							days!
						</Text>
						<Text style={style.text}>
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
	chart: { marginVertical: 30 },
	text: { margin: 3.5, textAlign: "center", fontWeight: "bold" },
});

export default StatsScreen;
