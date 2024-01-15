import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../../constants/theme";

const ProgressBar = ({
	handleOnSubmit,
	gameFinished,
	tryAgain,
	openedQuiz,
	navigation,
}) => {
	const minPercentage = 0, // 0 %
		maxPercentage = 100, // 100 %
		deltaPercentage = 2, // % for 1 seconds
		oneSecond = 1000; // 1000 ms = 1 s
	const counter = useRef(new Animated.Value(minPercentage)).current;
	const countInterval = useRef(null);
	const [count, setCount] = useState(minPercentage);
	const [color, setColor] = useState(COLORS.success);
	const [progressBarFinished, setprogressBarFinished] = useState(false);
	const [
		tryAgainButNotProgressBarFinished,
		setTryAgainButNotProgressBarFinished,
	] = useState(false);

	useEffect(() => {
		if (openedQuiz && !gameFinished) {
			if (!progressBarFinished) {
				countInterval.current = setInterval(
					() => setCount((prev) => prev + deltaPercentage),
					oneSecond,
				);
			} else {
				clearInterval(countInterval.current);
				handleOnSubmit();
			}
		}
		return () => {
			clearInterval(countInterval);
		};
	}, [progressBarFinished, openedQuiz, tryAgainButNotProgressBarFinished]); 

	useEffect(() => {
		if (openedQuiz && !gameFinished) {
			load(count);
			getColor();
			if (count >= maxPercentage) {
				setCount(maxPercentage);
				setprogressBarFinished(true);
				clearInterval(countInterval.current);
			}
		} else {
			clearInterval(countInterval.current);
		}
		return () => {
			clearInterval(countInterval);
		};
	}, [count]);

	useEffect(() => {
		if (tryAgain) {
			reset();
			if (!progressBarFinished) {
				setTryAgainButNotProgressBarFinished(!tryAgainButNotProgressBarFinished);
			}
		}
	}, [tryAgain, openedQuiz]);

	navigation.addListener("blur", () => {
		reset();
	});

	const load = (value) => {
		Animated.timing(counter, {
			toValue: value,
			duration: oneSecond,
			useNativeDriver: false,
		}).start();
	};

	const reset = () => {
		setCount(minPercentage);
		setColor(COLORS.success);
		setprogressBarFinished(false);
		setTryAgainButNotProgressBarFinished(false);
	};

	const getColor = () => {
		if (count >= 25 && count < 50) {
			setColor(COLORS.warning);
		} else if (count >= 50 && count < 75) {
			setColor(COLORS.orange);
		} else if (count >= 75 && count < maxPercentage) {
			setColor(COLORS.error);
		}
	};

	const width = counter.interpolate({
		inputRange: [minPercentage, maxPercentage],
		outputRange: [`${minPercentage}%`, `${maxPercentage}%`],
		extrapolate: "clamp",
	});

	return (
		<View style={style.container}>
			<View style={style.progressBar}>
				<Animated.View
					style={{
						...StyleSheet.absoluteFill,
						backgroundColor: color,
						width,
					}}
				/>
			</View>
			<StatusBar style="auto" />
		</View>
	);
};

const style = StyleSheet.create({
	container: {
		backgroundColor: COLORS.white,
	},
	progressBar: {
		width: "100%",
		height: 11,
		borderWidth: 2,
		borderRadius: 10,
		borderColor: COLORS.secondary,
	},
});

export default ProgressBar;
