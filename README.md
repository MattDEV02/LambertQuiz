  

# LambertQuiz

  

  

<p align="center">
<img  title="LambertQuiz Logo"  alt="LambertQuiz Logo"  width="19.5%"  src="./assets/images/logo.png">
</p>

  

  

LambertQuiz is a React Native-based and cross-platform mobile app that offers an interactive quiz on various topics.

  

  

## Key Features ✨

  

  

-  **Quiz on various topics:** Users can choose from a wide range of topics for the quiz, including mathematics, science, history, geographics, and more.

-  **Game Modes:** Timed gameplay with final scoring.

-  **Security:** The user's sensitive data, such as their password, are encrypted and stored in a very robust database.  

-  **Results Display:** Shows the final score and correct / incorrect answers.

-  **Dynamic sounds:** Quizzes with beatiful sounds!

- **Language:** There is only the English language.

  

  

## Screenshots 📸

  

  

<p align="center">
<img  title="LambertQuiz LoginScreen screenshoot 1"  alt="LambertQuiz LoginScreen screenshoot 1"  src="https://matteolambertucci.altervista.org/lambertquiz/screenshoots/loginscreen1.jpeg"  width="35%">
<img  title="LambertQuiz LoginScreen screenshoot 2"  alt="LambertQuiz LoginScreen screenshoot 2"  src="https://matteolambertucci.altervista.org/lambertquiz/screenshoots/loginscreen2.jpeg"  width="35%">
<img  title="LambertQuiz RegScreen screenshoot 1"  alt="LambertQuiz RegScreen screenshoot 1"  src="https://matteolambertucci.altervista.org/lambertquiz/screenshoots/regscreen1.jpeg"  width="35%"><br />
<img  title="LambertQuiz RegScreen screenshoot 2"  alt="LambertQuiz RegScreen screenshoot 2"  src="https://matteolambertucci.altervista.org/lambertquiz/screenshoots/regscreen2.jpeg"  width="35%">
<img  title="LambertQuiz RegScreen screenshoot 3"  alt="LambertQuiz RegScreen screenshoot 3"  src="https://matteolambertucci.altervista.org/lambertquiz/screenshoots/regscreen3.jpeg"  width="35%">
<img  title="LambertQuiz HomeScreen screenshoot 1"  alt="LambertQuiz HomeScreen screenshoot 1"  src="https://matteolambertucci.altervista.org/lambertquiz/screenshoots/homescreen1.jpeg"  width="35%">
<img  title="LambertQuiz HomeScreen screenshoot 2"  alt="LambertQuiz HomeScreen screenshoot 2"  src="https://matteolambertucci.altervista.org/lambertquiz/screenshoots/homescreen2.jpeg"  width="35%">
<img  title="LambertQuiz PlayQuizScreen screenshoot"  alt="LambertQuiz PlayQuizScreen screenshoot"  src="https://matteolambertucci.altervista.org/lambertquiz/screenshoots/playquizscreen1.jpeg"  width="35%">
<img  title="LambertQuiz PlayQuizScreen screenshoot"  alt="LambertQuiz PlayQuizScreen screenshoot"  src="https://matteolambertucci.altervista.org/lambertquiz/screenshoots/playquizscreen2.jpeg"  width="35%">
<img  title="LambertQuiz PlayQuizScreen screenshoot"  alt="LambertQuiz PlayQuizScreen screenshoot"  src="https://matteolambertucci.altervista.org/lambertquiz/screenshoots/playquizscreen3.jpeg"  width="35%"><br />
<img  title="LambertQuiz AccountScreen screenshoot 1"  alt="LambertQuiz AccountScreen screenshoot 1"  src="https://matteolambertucci.altervista.org/lambertquiz/screenshoots/accountscreen1.jpeg"  width="35%">
<img  title="LambertQuiz AccountScreen screenshoot 2"  alt="LambertQuiz AccountScreen screenshoot 2"  src="https://matteolambertucci.altervista.org/lambertquiz/screenshoots/accountscreen2.jpeg"  width="35%">
<img  title="LambertQuiz AccountScreen screenshoot 3"  alt="LambertQuiz AccountScreen screenshoot 3"  src="https://matteolambertucci.altervista.org/lambertquiz/screenshoots/accountscreen3.jpeg"  width="35%">
<img  title="LambertQuiz AccountScreen screenshoot 4"  alt="LambertQuiz AccountScreen screenshoot 4"  src="https://matteolambertucci.altervista.org/lambertquiz/screenshoots/accountscreen4.jpeg"  width="35%">
<img  title="LambertQuiz AccountScreen screenshoot 5"  alt="LambertQuiz AccountScreen screenshoot 5"  src="https://matteolambertucci.altervista.org/lambertquiz/screenshoots/helpscreen.jpeg"  width="35%">
</p>

  

  

## Installation 🚀 and usage⚡
  

### Requirements

- Node.js

- React Native

- NPM or Yarn
  
  
### Installation Instructions

  

  

1. Clone the repository:

  

  

```bash
git  clone  https://github.com/MattDEV02/LambertQuiz.git
```

  

  

2. Navigate to the project directory:

  

  

```bash
cd  LambertQuiz
```

  

  

3. Install dependencies:

  

  

```bash
npm  install

# or using yarn

# yarn install
```

  

  

4. Start the application:

  

  

```bash
npm  start

# or using yarn

# yarn start
```

 
 
**P.S. = You can do both third and fourth step with "my comand script":**

```bash
npm  run  all
```
  
## Some code examples

### `SigninScreen.js`

```javascript 
import React, { useState } from "react";
import { Text, SafeAreaView, Alert as Window } from "react-native";
import FormInput from "../components/shared/FormInput";
import FormButton from "../components/shared/FormButton";
import FormFooter from "../components/shared/FormFooter";
import { signIn } from "../utils/auth";
import { COLORS, appName } from "../constants/theme";
import {
	emailMaxLength,
	passwordMaxLength,
} from "../constants/fieldsConstants";
import { validateEmail, validatePassword } from "../utils/validators.js";

const SignInScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [emailSuccess, setEmailSuccess] = useState(false);
	const [passwordSuccess, setPasswordSuccess] = useState(false);

	const fieldsReset = () => {
		setEmail("");
		setPassword("");
		setEmailError(false);
		setEmailSuccess(false);
		setPasswordError(false);
		setPasswordSuccess(false);
	};

	const emailFieldError = () => {
		setEmailError(true);
		setEmailSuccess(false);
	};

	const emailFieldSuccess = () => {
		setEmailError(false);
		setEmailSuccess(true);
	};

	const passwordFieldError = () => {
		setPasswordError(true);
		setPasswordSuccess(false);
	};

	const passwordFieldSuccess = () => {
		setPasswordError(false);
		setPasswordSuccess(true);
	};

	const handleOnPress = () => {
		if (validateEmail(email)) {
			emailFieldSuccess();
		} else {
			emailFieldError();
			Window.alert("Email not valid", "Please enter a valid email.");
		}
		if (validatePassword(password)) {
			passwordFieldSuccess();
		} else {
			passwordFieldError();
			Window.alert(
				"Password not valid",
				"Password not valid, use minimum 8 chars with numbers, lowercase and uppercase letters.",
			);
		}
		if (validateEmail(email) && validatePassword(password)) {
			if (signIn(email, password)) {
				emailFieldSuccess();
				passwordFieldSuccess();
			} else {
				emailFieldError();
				passwordFieldError();
			}
			fieldsReset();
		} 
	};

	navigation.addListener("blur", () => {
		fieldsReset();
	});

	return (
		<SafeAreaView
			style={{
				backgroundColor: COLORS.white,
				flex: 1,
				alignItems: "center",
				justifyContent: "flex-start",
				padding: 20,
			}}
		>
			<Text
				style={{
					fontSize: 30,
					color: COLORS.black,
					fontWeight: "bold",
					marginVertical: 25,
				}}
			>
				{appName}
			</Text>
			<FormInput
				labelText="Email"
				placeholderText="Enter your email"
				value={email}
				inputError={emailError}
				inputSuccess={emailSuccess}
				keyboardType="email-address"
				autoComplete={"off"}
				autoCorrect={false}
				maxLength={emailMaxLength}
				autocapitalize={"none"}
				spellcheck={false}
				inputMode={"email"}
				onChangeText={(value) => setEmail(value)}
				onEndEditing={(event) =>
					setEmail(event.nativeEvent.text.toLowerCase())
				}
			/>
			<FormInput
				labelText="Password"
				placeholderText="Enter your password (8 chars)"
				value={password}
				inputError={passwordError}
				inputSuccess={passwordSuccess}
				autoComplete={"off"}
				autoCorrect={false}
				maxLength={passwordMaxLength}
				secureTextEntry={true}
				onChangeText={(password) => setPassword(password)}
			/>
			<FormButton
				labelText="Submit"
				handleOnPress={() => handleOnPress()}
				style={{ width: "100%", marginTop: 4, borderRadius: 13 }}
				textStyle={{color: COLORS.white, fontSize: 21}}
			/>
			<FormFooter
				handleOnPress={() => navigation.navigate("Sign Up page")}
			/>
		</SafeAreaView>
	);
};

export default SignInScreen;

```


### `HomeScreen.js`

```javascript 
import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SafeAreaView,
	FlatList,
	ScrollView,
	StyleSheet,
} from "react-native";
import { supabase } from "../app/lib/supabase-client";
import Quiz from "../components/screens/HomeScreen/Quiz";
import FormInput from "../components/shared/FormInput";
import { COLORS } from "../constants/theme";
import {
	validateObject,
	validateString,
	validateArray,
} from "../utils/validators";
import { playClickSound } from "../utils/sounds";

const HomeScreen = ({ navigation, route }) => {
	const user = route.params.user;
	console.log(user);
	const [quizzes, setQuizzes] = useState([]);
	const [quiz, setQuiz] = useState("");
	const [searching, setSearching] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		const getQuizzes = async () => {
			setRefreshing(true);
			const { data, error } = await supabase
				.from("quizzes")
				.select()
				.order("category");
			if (validateObject(error)) {
				console.error(error);
				setRefreshing(false);
			} else if (validateArray(data, 1)) {
				setQuizzes(data);
			}
			setRefreshing(false);
		};

		const getQuizzesWithSearching = async () => {
			setRefreshing(true);
			const { data, error } = await supabase.rpc("get_searched_quizzes", {
				quiz_category: quiz,
			});
			if (validateObject(error)) {
				console.error(error);
				setRefreshing(false);
			} else if (validateArray(data, 0)) {
				setQuizzes(data);
			} else if (!validateString(quiz)) {
				setSearching(false);
				getQuizzes();
			}
			setRefreshing(false);
		};

		searching ? getQuizzesWithSearching() : getQuizzes();
	}, [quiz]);

	const handleOnPlayPress = async (quiz_id) => {
		await playClickSound();
		navigation.setParams({ quizId: quiz_id });
		navigation.navigate("Play Quiz page", {
			quizId: quiz_id,
			openedQuiz: true,
		});
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: COLORS.background,
				position: "relative",
			}}
		>
			{/* TOP BAR */}
			<ScrollView
				style={{
					marginBottom: 6.75,
				}}
			>
				<View>
					{/* Welcome title */}
					<View
						style={{
							...style.container,
							marginTop: 27.5,
						}}
					>
						<Text style={{ ...style.text, fontSize: 29 }}>
							Welcome{" "}
							{validateObject(user) && validateString(user.username)
								? user.username
								: null}{" "}
							!
						</Text>
					</View>

					{/* Quiz search form */}
					<View style={style.container}>
						<FormInput
							placeholderText="Search for a Quiz"
							value={quiz}
							maxLength={15}
							autoComplete={"name"}
							autoCorrect={true}
							inputMode={"text"}
							keyboardType={"default"}
							inputError={false}
							inputSuccess={false}
							onChangeText={(quiz) => {
								setQuiz(quiz);
								setSearching(true);
							}}
							style={{ width: "89%" }}
							inputStyle={{
								marginTop: 7.5,
								marginBottom: 5,
								paddingVertical: 15,
								backgroundColor: COLORS.white,
								borderWidth: 0.35,
								borderColor: COLORS.secondary,
								borderRadius: 11,
								fontSize: 16,
							}}
						/>
					</View>
					{/* Quiz list */}
					{validateArray(quizzes, 1) ? (
						<FlatList
							data={quizzes}
							scrollEnabled={false}
							onRefresh={() => undefined}
							refreshing={refreshing}
							showsVerticalScrollIndicator={false}
							keyExtractor={(item) => item.quiz_id}
							renderItem={({ item: quiz }) => (
								<Quiz
									quiz={quiz}
									handleOnPlayPress={() =>
										handleOnPlayPress(quiz.quiz_id)
									}
								/>
							)}
						/>
					) : searching ? (
						<View style={{ ...style.container, marginTop: 47 }}>
							<Text style={{ ...style.text, color: "#EF0909" }}>
								NO Quizzes found.
							</Text>
						</View>
					) : null}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const style = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		fontSize: 26.5,
		color: COLORS.black,
		fontWeight: "bold",
	},
});

export default HomeScreen;

```

### `StatsScreen.js` 

```javascript  
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
				//objectsArray[i].totalscore,
				objectsArray[i].worstscore,
				objectsArray[i].betterscore,
				objectsArray[i].totalquizzes,
				objectsArray[i].quizzescompletitionpercentage,
			];
			for (i = 0; i < 5; i++) matrix.push(row); //
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
						{validateArray(quizzesDays, 1) ? (
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

```

## Author  ©️

Made with ❤️ by:

- **Matteo Lambertucci (MattDEV02)**  
	
	- [GitHub Profile](https://github.com/MattDEV02) 
	- [Linkedin Profile](https://www.linkedin.com/in/matteo-lambertucci-134073211)
	- [Instagram Profile](https://www.instagram.com/_matte.02_/)
	- [Moodle Profile](https://ingegneriacivileinformaticatecnologieaeronautiche.el.uniroma3.it/user/profile.php?id=5522)

I am the only author of this beatiful app 😉
  

  

## Technologies used 🧑‍💻
  
  

-  **Javascript ES6**

  

-  **React native 0.72.6**

  

-  **NodeJS 20.4.0**

  

-  **NPM 9.7.2**

  

-  **PostgreSQL 16.0**

  

-  **Visual Studio Code 1.85**

  

-  **Supabase 1.0**

  

-  **Altervista hosting**

  

-  **Bootstrap 5**

  

-  **HTML 5**

  

-  **CSS 4.15**

  

-  **Windows 11**

  

## Project structure 🏠

-  **`src/`**: The main folder for the application source code.

	- **`src/components/`**: Contains all reusable components of the application.

	- **`src/screens/`**: Primary screens of the application, each associated with specific functionalities.

	- **`src/navigators/`**: Configuration and management of application navigation, using React Navigation or a similar library.

	- **`src/utils/`**: Utility functions, or helpers used across multiple parts of the code.

	- **`src/constants/`**: Utility constants, or helpers used across multiple parts of the code.

	- **`src/App.js`**: The main component of this project, it gets rendered in the index.js file (see below).

-  **`assets/`**: Images, fonts, or other multimedia assets used in the application.

-  **`tests/`** Contains tests for various components, functionalities, or application logic.

-  **`index.js`**: The main entry of this project.

-  **`lambertquiz.sql`**: A SQL (PostGreSQL) script file that allows to create the database that I used for this App.

-  **`package.json`**: JSON metadata file that to define various properties and configurations related to the project, including its dependencies, scripts, version information, and other metadata.

-  **`README.md`**: Markdown documentation of this project.

-  **`android/`**: Contains Android-specific files, including configuration files, manifest, etc.

-  **`ios/`**: Contains iOS-specific files, including configuration files, assets, etc.

## Sources   🤝

- [Wikipedia](https://it.wikipedia.org/wiki/Pagina_principale) 
- [Il Messaggero](https://www.ilmessaggero.it/)
- [The New York Times](https://www.nytimes.com/)
- [Francia Turismo](www.franciaturismo.net)
- [The Sun](https://www.thesun.co.uk/)


## ER Model 🔢

  

<img  title="LambertQuiz ER model"  alt="LambertQuiz ER model"  src="https://matteolambertucci.altervista.org/lambertquiz/planning/ER_model.jpeg"  width="100%">

  

  

## Relational model 🔣

  

  

<img  title="LambertQuiz ER model"  alt="LambertQuiz ER model"  src="https://matteolambertucci.altervista.org/lambertquiz/planning/relational_model.jpeg"  width="100%">

  

  

## License 🗒️

  

  

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for more details.