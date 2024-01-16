import React from "react";
import { View, Alert as Window } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { COLORS, appName } from "../../../constants/theme";
import { validateObject } from "../../../utils/validators";

const StatsCalendar = ({ data, user }) => {
	const quizTaken = { key: "quizTaken", color: COLORS.black },
		userSub = { key: "userSub", color: COLORS.white },
		userUpd = { key: "userUpd", color: "#CF13A6" };
	const calendarFormat = "YYYY-MM-DD";
	const _userSubDate = moment(user.email_confirmed_at).format(calendarFormat),
		_userUpdatedDate = moment(user.updated_at).format(calendarFormat);
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

	if (validateObject(markedDates[_userSubDate])) {
		markedDates[_userSubDate].dots.push(userSub);
	} else {
		markedDates[_userSubDate] = {
			...markedDateObjProperties,
			dots: [userSub],
		};
	}

	if (user.inserted_at !== user.updated_at) {
		if (validateObject(markedDates[_userUpdatedDate])) {
			markedDates[_userUpdatedDate].dots.push(userUpd);
		} else {
			markedDates[_userUpdatedDate] = {
				...markedDateObjProperties,
				dots: [userUpd],
			};
		}
	}

	const handleOnPlayPress = (stringDay) => {
		const formattedStringDay =  moment(stringDay).format("DD/MM/YYYY");
		const base = "In day " + formattedStringDay;
		const markedDate = markedDates[stringDay];
		let outputString = base;
		if (!validateObject(markedDate)) {
			outputString += " you didn't play with " + appName + ".";
		} else if (
			markedDate.dots.includes(quizTaken) &&
			!markedDate.dots.includes(userSub) &&
			!markedDate.dots.includes(userUpd)
		) {
			outputString += " you played with " + appName + "!";
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
			outputString += " you updated your " + appName + " Account!";
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
			outputString += " you played with us and updated your " + appName + " account!";
		} else if (
			!markedDate.dots.includes(quizTaken) &&
			markedDate.dots.includes(userSub) &&
			markedDate.dots.includes(userUpd)
		) {
			outputString += " you signed up and updated your " + appName + " account!";
		} else if (
			markedDate.dots.includes(quizTaken) &&
			markedDate.dots.includes(userSub) &&
			markedDate.dots.includes(userUpd)
		) {
			outputString += " you played, signed up and updated your account for " + appName + "!";
		}
		Window.alert(formattedStringDay, outputString);
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
				maxDate={moment().format(calendarFormat)}
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
