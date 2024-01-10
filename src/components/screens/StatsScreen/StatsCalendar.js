import React from "react";
import { View, Alert as Window } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { COLORS, appName } from "../../../constants/theme";
import { validateObject } from "../../../utils/validators";


const StatsCalendar = ({ data, userSubDate }) => {
	const quizTaken = { key: "quizTaken", color: COLORS.black },
		userSub = { key: "userSub", color: "#CF13A6" };
	let markedDates = {};
	data.map((item) => {
		markedDates[item.quiz_day] = {
			selected: true,
			marked: true,
			selectedColor: COLORS.primary,
			selectedTextColor: COLORS.white,
			dotColor: COLORS.white,
			dots: [quizTaken],
		};
	});

	if (validateObject(markedDates[userSubDate])) {
		markedDates[userSubDate].dots.push(userSub);
	} else {
		markedDates[userSubDate] = {
			selected: true,
			marked: true,
			selectedColor: COLORS.primary,
			selectedTextColor: COLORS.white,
			dotColor: COLORS.white,
			dots: [quizTaken, userSub],
		};
	}

	const handleOnPlayPress = (stringDay) => {
		const base = "In day " + moment(stringDay).format("DD/MM/YYYY");
		const markDate = markedDates[stringDay];
		if (!validateObject(markDate)) {
			Window.alert(base + " you didn't play with " + appName + " !");
		} else if (
			validateObject(markDate.dots[0]) &&
			!validateObject(markDate.dots[1])
		) {
			Window.alert(base + " you played with " + appName + " !");
		} else if (
			!validateObject(markDate.dots[0]) &&
			validateObject(markDate.dots[1])
		) {
			Window.alert(base + " you signed up for " + appName + " !");
		} else {
			Window.alert(
				base + " you signed up for " + appName + " and played with it !",
			);
		}
	};

	return (
		<View>
			<Calendar
				style={{
					borderWidth: 1,
					borderColor: COLORS.grey,
				}}
				theme={{
					textMonthFontSize: 23,
					"stylesheet.calendar.header": {
						dayTextAtIndex5: {
							color: COLORS.success,
						},
						dayTextAtIndex6: {
							color: COLORS.error,
						},
					},
				}}
				
				enableSwipeMonths={true}
				maxDate={moment().format("YYYY-MM-DD")}
				firstDay={1}
				showWeekNumbers={true}
				markingType={"multi-dot"}
				disableAllTouchEventsForDisabledDays={true}
				markedDates={markedDates}
				onDayPress={(day) => handleOnPlayPress(day.dateString)}
			/>
		</View>
	);
};

export default StatsCalendar;
