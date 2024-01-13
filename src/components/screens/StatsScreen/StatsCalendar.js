import React from "react";
import { View, Alert as Window } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { COLORS, appName } from "../../../constants/theme";
import { validateObject } from "../../../utils/validators";

const StatsCalendar = ({ data, userSubDate, userUpdatedDate }) => {
	const quizTaken = { key: "quizTaken", color: COLORS.black },
		userSub = { key: "userSub", color: COLORS.white },
		userUpd = { key: "userUpd", color: "#CF13A6" };
	let markedDates = {};
	const markedDateObjProperties = {
		selected: true,
		marked: true,
		selectedColor: COLORS.primary,
		selectedTextColor: COLORS.white,
		dotColor: COLORS.white,
	};
	data.map((item) => {
		markedDates[item.quiz_day] = {
			...markedDateObjProperties,
			dots: [quizTaken],
		};
	});

	if (validateObject(markedDates[userSubDate])) {
		markedDates[userSubDate].dots.push(userSub);
	} else {
		markedDates[userSubDate] = {
			...markedDateObjProperties,
			dots: [userSub],
		};
	}

	if (validateObject(markedDates[userUpdatedDate])) {
		markedDates[userUpdatedDate].dots.push(userUpd);
	} else {
		markedDates[userUpdatedDate] = {
			...markedDateObjProperties,
			dots: [userUpd],
		};
	}

	const handleOnPlayPress = (stringDay) => {
		const base = "In " + moment(stringDay).format("DD/MM/YYYY");
		const markedDate = markedDates[stringDay];
		let outputString = base;
		if (!validateObject(markedDate)) {
			outputString += " you didn't play with us.";
		} else if (
			markedDate.dots.includes(quizTaken) &&
			!markedDate.dots.includes(userSub) &&
			!markedDate.dots.includes(userUpd)
		) {
			outputString += " you played with us!";
		} else if (
			!markedDate.dots.includes(quizTaken) &&
			markedDate.dots.includes(userSub) &&
			!markedDate.dots.includes(userUpd)
		) {
			outputString += " you signed up for " + appName + "!";
		} else if (
			!markedDate.dots.includes(quizTaken) &&
			!markedDate.dots.includes(userSub) &&
			markedDate.dots.includes(userUpd)
		) {
			outputString += " you updated your Account!";
		} else if (
			markedDate.dots.includes(quizTaken) &&
			markedDate.dots.includes(userSub) &&
			!markedDate.dots.includes(userUpd)
		) {
			outputString +=
				" you played with us and signed up for " + appName + "!";
		} else if (
			markedDate.dots.includes(quizTaken) &&
			!markedDate.dots.includes(userSub) &&
			markedDate.dots.includes(userUpd)
		) {
			outputString += " you played with us and updated your account!";
		} else if (
			!markedDate.dots.includes(quizTaken) &&
			markedDate.dots.includes(userSub) &&
			markedDate.dots.includes(userUpd)
		) {
			outputString +=
				" you signed up and updated your account!";
		} else if (
			markedDate.dots.includes(quizTaken) &&
			markedDate.dots.includes(userSub) &&
			markedDate.dots.includes(userUpd)
		) {
			outputString += " you played, signed up and updated your account!";
		}
		Window.alert(outputString);
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
