import express, { Request, Response } from "express";
import mongoose, { QueryCursor } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";

import userSchema from "./models/userSchema";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;
const MOVIES = {
	movielist: [
		{
			name: "avengers",
			date: "2001",
			rating: 5,
		},
		{
			name: "avengers 2",
			date: "2004",
			rating: 5,
		},
		{
			name: "avengers 3",
			date: "2008",
			rating: 5,
		},
	],
};
// interface User {
// 	email: string;
// 	password: string;
// 	name: string;
// }
// const USERS: Array<User> = [];
// let REFRESH_TOKENS: string[] = [];

app.use(cors());
app.use(express.json());

const mongodbURI: string = process.env.MONGODB_URI ?? "";
mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("connected to my mongoose");
});

app.get("/", (req: Request, res: Response) => {
	console.log("test");
	res.send("welcome to the my api");
});

app.get("/movies", authenticateToken, (req: Request, res: Response) => {
	// res.send(`welcome ${(req as any).user}`);
	// if (req.query || (req as any).query?.number)
	// 	res.json(MOVIES["movielist"][(req as any).query.number]);
	// else res.json(MOVIES["movielist"]);
	res.json(MOVIES["movielist"]);
});

app.post("/login", async (req: Request, res: Response) => {
	const { email, password, username: name } = req.body;

	const query = await userSchema.findOne({ $or: [{ name }, { email }] });
	if (query) {
		if (password === (query as any).password) {
			const accessToken = generateAccessToken({ email, password, name });
			const refreshToken = jwt.sign(name, "verysecret");

			(query as any).refreshToken = refreshToken;
			try {
				await query.save();
			} catch (err) {
				console.log(err);
				res.json({ err: "cannot update refresh token" });
			}

			res.cookie("accessToken", accessToken, {
				expires: new Date(Date.now() + 0.5 * 3600000),
				secure: false,
				httpOnly: true,
			});

			res.cookie("refreshToken", refreshToken, {
				// expires: new Date(Date.now() + 0.5 * 3600000),
				secure: false,
				httpOnly: true,
			});

			// res.json({
			// 	success: "successfully logged in",
			// 	accessToken,
			// 	refreshToken,
			// });
		} else {
			res.json({ err: "username and password do not match" });
		}
	} else {
		res.json({ err: "no user exists with that email/username or password" });
	}

	// const isUser: boolean = USERS.some((email) => email === email);
	// if (!isUser) res.json({ error: "user with that email does not exist" });
	// else {
	// 	// USERS.findIndex((user) => user.email === email && user.password === password);
	// 	const index = USERS.map((user) => user?.email).indexOf(email);
	// 	if (USERS[index]?.password === password) {
	// 		REFRESH_TOKENS.push(refreshToken);
	// 		res.json({ accessToken, refreshToken });
	// 	}
	// }
});

app.post("/signup", async (req: Request, res: Response) => {
	const { email, password, username: name } = req.body;
	console.log("signup");

	const query = await userSchema.find({ email });
	console.log("query ", query);
	if (!query[0]) {
		console.log("user does not exist");
		const user = { name, email, password };
		const accessToken = generateAccessToken(user);
		const refreshToken = jwt.sign(name, "verysecret");

		const newUser = new userSchema({
			username: name,
			email,
			password,
			refToken: refreshToken,
		});

		try {
			await newUser.save();

			console.log("before cookie");

			res.cookie("accessToken", accessToken, {
				expires: new Date(Date.now() + 0.5 * 3600000),
				secure: false,
				httpOnly: true,
			});

			res.cookie("refreshToken", refreshToken, {
				// expires: new Date(Date.now() + 0.5 * 3600000),
				secure: false,
				httpOnly: true,
			});

			res.json({ accessToken, refreshToken });

			// console.log("after cookie: ", req);
		} catch (err) {
			res.status(500).json(err);
		}

		return;
	} else {
		res.json({ err: "user with that email already exists" });
	}
	// USERS.push({ email, password, name });
	// REFRESH_TOKENS.push(refreshToken);
	// res.json({ accessToken, refreshToken });
});

app.post("/logout", async (req: Request, res: Response) => {
	const { refreshToken, accessToken } = req.headers;

	const query = await userSchema.findOne({ refreshToken });
	if (query) {
		try {
			// res.cookie("accessToken", "none", {
			// 	expires: new Date(Date.now() + 0.1 * 1000),
			// 	httpOnly: true,
			// });

			// res.cookie("refreshToken", "none", {
			// 	expires: new Date(Date.now() + 0.1 * 1000),
			// 	httpOnly: true,
			// });
			(query as any).refToken = "";
			await query.save();

			res.sendStatus(204);
		} catch (err) {
			console.log(err);
			res.json({ err: "cannot successfully logout" });
		}
	} else {
		res.json({ err: "cannot find user with that refresh token" });
	}

	// REFRESH_TOKENS = REFRESH_TOKENS.filter((token) => token !== req.body.token);
});

app.post("/refreshtoken", async (req: Request, res: Response) => {
	const { refreshToken } = req.body;

	if (refreshToken === null) return res.sendStatus(401);

	const query = await userSchema.findOne({ refreshToken });
	console.log(query);
	if (!query) return res.sendStatus(403);
	else {
		(query as any).refreshToken = refreshToken;
		try {
			await query.save();
		} catch (err) {
			console.log(err);
			res.json({ err: "cannot find user with that refresh token" });
		}
	}

	jwt.verify(refreshToken, "verysecret", (err: any, user: any) => {
		if (err) return res.sendStatus(403);
		const accessToken = generateAccessToken(user.name);
		res.json({ accessToken });
	});
	// if (!REFRESH_TOKENS.includes(refreshToken)) return res.sendStatus(403);
});

function generateAccessToken(user: object) {
	return jwt.sign(user, "verysecret", { expiresIn: "15m" });
}

function authenticateToken(req: Request, res: Response, next: any) {
	const { authentication } = req.headers;
	const token = authentication && (authentication as string).split(" ")[1];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, "verysecret", (err, user) => {
		if (err) return res.sendStatus(403);
		(req as any).user = user;
		next();
	});
}

app.listen(PORT, () => console.log(`Server listening on port ${PORT}. http://localhost:${PORT}/`));
