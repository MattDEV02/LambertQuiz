import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SafeAreaView,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import {
	Table,
	TableWrapper,
	Row,
	Rows,
	Col,
	Cols,
	Cell,
} from "react-native-table-component";
import { supabase } from "../app/lib/supabase-client";
import {
	validateObject,
	validateURL,
	validateArray,
} from "../utils/validators";
import { COLORS } from "../constants/theme";

const StatsScreen = ({ navigation }) => {
	const [usersQuizzes10Stats, setUsersQuizzes10Stats] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [matrix, setMatrix] = useState([[]]);

	const userId = 1;
	useEffect(() => {
		const getUsersQuizzes10Stats = async () => {
			setRefreshing(true);
			const { data, error } = await supabase.rpc(
				"get_users_quizzes_10_stats",
			);
			if (validateObject(error)) {
				console.error(error);
			} else if (validateArray(data, 1)) {
				console.log("a", data);
				setUsersQuizzes10Stats(data);
				setMatrix(toMatrix(data));
				console.log("b", usersQuizzes10Stats);
			}
			setRefreshing(false);
		};

		getUsersQuizzes10Stats();
	}, []);

	const toMatrix = (objectsArray) => {
		const matrix = [];
		for (let i = 0; i < objectsArray.length; i += 2) {
			const riga = [
				objectsArray[i].averagescore,
				objectsArray[i].betterscore,
				objectsArray[i].quizzescompletitionpercentage,
				objectsArray[i].totalquizzes,
				objectsArray[i].totalscore,
				objectsArray[i].username,
			];
			matrix.push(riga);
		}
		console.log(matrix);
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
				{validateArray(usersQuizzes10Stats, 1) && validateArray(matrix, 1) ? (
					<Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
						<Row
							data={Object.keys(usersQuizzes10Stats[0])}
							style={style.head}
							textStyle={style.text}
						/>
						<Rows data={[[2, 2, 33, 1, 2, "Matt"]]} textStyle={style.text} />
					</Table>
				) : (
					<Text>ciao</Text>
				)}
			</View>
		</SafeAreaView>
	);
};

const style = StyleSheet.create({
	container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
	head: { height: 40, backgroundColor: "#f1f8ff" },
	text: { margin: 6 },
	row: { height: 40, backgroundColor: "#E7E6E1" },
});

export default StatsScreen;
