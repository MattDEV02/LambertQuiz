import emailjs from "emailjs-com";
import {
	SUPABASE_NOREPLY,
	EMAILJS_SERVICE_ID,
	EMAILJS_TEMPLATE_ID,
	EMAILJS_PUBLIC_KEY,
} from "@env";
import { appName } from "../constants/theme";

export const sendEmailForUsernameChanged = async (user) => {
	emailjs
		.send(
			EMAILJS_SERVICE_ID,
			EMAILJS_TEMPLATE_ID,
			{
				to_email: user.email,
            to_name: user.email,
				from_name: appName,
				from_email: SUPABASE_NOREPLY,
            subject: appName + " username changed",
				message:
					"You have just changed your " +
					appName +
					" username in " +
					user.username + ".",
			},
			EMAILJS_PUBLIC_KEY,
		)
		.then((response) => {
			console.log("Changed username Response mail: ", response);
		})
		.catch((error) => {
			console.error(error);
		});
};

export const sendEmailForPasswordChanged = async (user) => {
	emailjs
		.send(
			EMAILJS_SERVICE_ID,
			EMAILJS_TEMPLATE_ID,
			{
				to_email: user.email,
            to_name: user.email,
				from_name: appName,
				from_email: SUPABASE_NOREPLY,
            subject: appName + " password changed",
				message:
					"You have just changed your " +
					appName +
					" password (username = " +
					user.username + " ).",
			},
			EMAILJS_PUBLIC_KEY,
		)
		.then((response) => {
			console.log("Changed password Response mail: ", response);
		})
		.catch((error) => {
			console.error(error);
		});
};

export const sendEmailForAccountDeleted = async (user) => {
	emailjs
		.send(
			EMAILJS_SERVICE_ID,
			EMAILJS_TEMPLATE_ID,
			{
				to_email: user.email,
            to_name: user.email,
				from_name: appName,
				from_email: SUPABASE_NOREPLY,
            subject: appName + " account deleted",
				message:
					"You have just deleted your " +
					appName +
					" account with this email: " +
					user.email + " and this username: "+
               user.username + ".",
			},
			EMAILJS_PUBLIC_KEY,
		)
		.then((response) => {
			console.log("Deleted account Response mail: ", response);
		})
		.catch((error) => {
			console.error(error);
		});
};
