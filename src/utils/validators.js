import { validate as emailValidator } from "email-validator";
import {
	emailMinLength,
	emailMaxLength,
	passwordMinLength,
	passwordMaxLength,
	usernameMinLength,
	usernameMaxLength,
} from "../constants/fieldsConstants";

export const validateBoolean = (value) => value === false || value === true;

export const validateString = (string) =>
	string !== undefined && string !== null && string !== ""; // && string !== " "

export const validateEmail = (email) =>
	validateString(email) &&
	emailValidator(email) &&
	email.length >= emailMinLength &&
	email.length <= emailMaxLength;

export const validatePassword = (password) =>
	validateString(password) &&
	password.search(/[a-z]/) > 0 &&
	password.search(/[0-9]/) > 0 &&
	password !== password.toLowerCase() &&
	password.length >= passwordMinLength &&
	password.length <= passwordMaxLength;

export const validateConfirmPassword = (password, confirmPassword) =>
	validatePassword(confirmPassword) && password === confirmPassword;

export const validateUsername = (username) =>
	validateString(username) &&
	username.length >= usernameMinLength &&
	username.length <= usernameMaxLength;

export const validateObject = (object) =>
	object != undefined && object != null && object != {}; // && object != {}

export const validateArray = (array, minLength) =>
	validateObject(array) && Array.isArray(array) && array.length >= minLength;

export const validateURL = (URL) =>
	validateString(URL) &&
	new RegExp("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?").test(
		URL,
	);
