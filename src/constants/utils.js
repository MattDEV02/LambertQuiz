import { validate } from "email-validator"; // alias
import GetAppName from 'react-native-get-app-name';

const validateString = (string) => {
	return string !== undefined && string !== null && string !== "";
};

export const validateEmail = (email) => {
	return validateString(email) && validate(email) && email.length >= 6;
};
export const validatePassword = (password) => {
	return validateString(password) && password.length === 8;
};

export const validateUsername = (username) => {
	return (
		validateString(username) && username.length >= 3 && username.length <= 8
	);
};
