import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SafeAreaView,
	InputScrollView,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import moment from "moment";
import { supabase } from "../app/lib/supabase-client";
import StatsTable from "../components/screens/StatsScreen/StatsTable";
import {
	validateObject,
	validateArray,
	validateString,
} from "../utils/validators";
import { COLORS, SIZES } from "../constants/theme";

const StatsScreen = ({ navigation, route }) => {
	const user = route.params.user;
	const userId = user.user_id;

	const userSub = moment(user.inserted_at).format("DD/MM/YYYY");
	const userSubDays = moment().diff(user.inserted_at, "days") + 1;

	const [usersQuizzesTenStats, setUsersQuizzesTenStats] = useState([]);
	const [userLastTenQuizzes, setUserLastTenQuizzes] = useState([]);
	const [userPrefCategory, setUserPrefCategory] = useState("");
	const [refreshing, setRefreshing] = useState(false);
	const [matrix, setMatrix] = useState([]);

	useEffect(() => {
		const getUsersQuizzesTenStats = async () => {
			setRefreshing(true);
			const { data, error } = await supabase.rpc(
				"get_users_quizzes_ten_stats",
			);
			if (validateObject(error)) {
				console.error(error);
			} else if (validateArray(data, 1)) {
				setUsersQuizzesTenStats(data);
				setMatrix(toMatrix(data));
			}
			setRefreshing(false);
		};

		const getUserLastTenDaysQuizzes = async (_user_id) => {
			setRefreshing(true);
			const { data, error } = await supabase.rpc(
				"get_last_ten_days_quizzes",
				{
					_user_id: _user_id,
				},
			);
			console.log(data);
			if (validateObject(error)) {
				console.error(error);
			} else if (validateArray(data, 10)) {
				let a = [];
				data.map((item, index) => {
					a.push({ value: item.totalquizzes, label: new String(index) });
				});
				setUserLastTenQuizzes(a);
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
			console.log(data);
			if (validateObject(error)) {
				console.error(error);
			} else if (validateObject(data) && validateString(data.category)) {
				setUserPrefCategory(data.category);
			}
			setRefreshing(false);
		};

		getUsersQuizzesTenStats();
		getUserLastTenDaysQuizzes(userId);
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
			matrix.push(row);
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
				{validateArray(usersQuizzesTenStats, 1) &&
				validateArray(matrix, 1) ? (
					<StatsTable matrix={matrix} />
				) : null}
				<View>
					<LineChart
						maxValue={1}
						adjustToWidth={true}
						isAnimated={true}
						backgroundColor={COLORS.orange}
						noOfSections={1}
						data={userLastTenQuizzes}
					/>
				</View>
				<View>
					<Text style={style.text}>
						You are our User since {userSub}, it's {userSubDays} days!
					</Text>
					<Text style={style.text}>
						Prefered category: {userPrefCategory}
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
};

const style = StyleSheet.create({
	chart: {},
	text: { margin: 3.5, textAlign: "center", fontWeight: "bold" },
});

export default StatsScreen;
