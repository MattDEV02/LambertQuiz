import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import moment from "moment";

const StatsCalendar = ({ data }) => {
   console.log(data);
   let a = {};
   let o = null;
   data.map(item => {
      a[moment(item.day).format("YYYY-MM-DD")]={
         selected: true,
         marked: true,
         selectedColor: "blue",
      };
   });
   console.log(a);
	return (
		<View>
			<Calendar
				onDayPress={(day) => {
					console.log("selected day", day);
				}}
				markedDates={a}
			/>
		</View>
	);
};

export default StatsCalendar;
