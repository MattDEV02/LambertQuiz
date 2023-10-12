import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fjjbztpzvhrabesuopnj.supabase.co";
const supabaseAnonKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqamJ6dHB6dmhyYWJlc3VvcG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTcwNTI2MDUsImV4cCI6MjAxMjYyODYwNX0.bwRmO-FDhNOfuK97-ycS4aenk6VZj_UaqWWYyrmffzA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: AsyncStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
