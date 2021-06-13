import React, { ReactElement, useContext, useState, useEffect } from "react";
// import firebase from 'firebase';
import axios from "axios";
import { auth } from "../firebase";

interface Props {
	children: any;
}

const AuthContext = React.createContext<any>({});

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }: Props): ReactElement {
	const [currentUser, setCurrentUser] = useState<any>();
	const [loading, setLoading] = useState<boolean>(true);

	function signup(email: string, password: string) {
		return auth.createUserWithEmailAndPassword(email, password);
	}

	function login(email: string, password: string) {
		return auth.signInWithEmailAndPassword(email, password);
	}

	function logout() {
		return auth.signOut();
	}

	function resetPassword(email: string) {
		return auth.sendPasswordResetEmail(email);
	}

	function updateEmail(email: string) {
		return currentUser.updateEmail(email);
	}

	function updatePassword(password: string) {
		return currentUser.updatePassword(password);
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const value = {
		currentUser,
		signup,
		login,
		logout,
		resetPassword,
		updateEmail,
		updatePassword,
	};

	return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

const PersAuthProvContext = React.createContext<any>({});

export function usePersAuth() {
	return useContext(PersAuthProvContext);
}

export function PersAuthProv({ children }: Props): ReactElement {
	interface User {
		token: string;
		refToken: string;
	}
	const [user, setUser] = useState<User | object>({});
	// let user: User | object = {};

	async function signup(email: string, password: string, username: string) {
		// axios
		// 	.post(
		// 		"http://localhost:3001/signup",
		// 		{
		// 			email,
		// 			password,
		// 			username,
		// 		},
		// 		{ headers: { "Content-Type": "application/json" } }
		// 	)
		// 	.then((res) => {
		// 		response = res?.data;
		// 		setUser({ token: res?.data?.accessToken, refToken: res?.data?.refreshToken });
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});

		const res = await axios.post(
			"http://localhost:3001/signup",
			{ email, password, username },
			{ headers: { "Content-Type": "application/json" } }
		);
		// const { data } = res;
		console.log(res);
		console.log(document.cookie);

		setUser(res.data);
	}

	const value = {
		user,
		signup,
	};

	return <PersAuthProvContext.Provider value={value}>{children}</PersAuthProvContext.Provider>;
}
