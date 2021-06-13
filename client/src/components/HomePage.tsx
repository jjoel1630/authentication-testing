import React, { ReactElement, useState } from "react";
import { Alert, Button, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {}

function HomePage({}: Props): ReactElement {
	const { currentUser, logout } = useAuth();
	const [error, setError] = useState<string>("");
	const history = useHistory();

	const handleLogout = async () => {
		setError("");

		try {
			await logout();
			history.push("/login");
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<Container>
			<h1>Welcome to the Home Page</h1>
			{error && <Alert variant="danger">{error}</Alert>}
			{currentUser ? (
				<div>
					<Link to="/dashboard">Dashboard</Link>
					<Button
						style={{ display: "block", margin: "0px" }}
						variant="link"
						onClick={handleLogout}>
						Logout
					</Button>
				</div>
			) : (
				<div>
					<Link to="/login" className="m-3">
						Login
					</Link>
					<Link to="/signup">Signup</Link>
				</div>
			)}
		</Container>
	);
}

export default HomePage;
