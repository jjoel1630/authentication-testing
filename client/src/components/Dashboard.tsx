import React, { ReactElement, useState } from "react";
import { Card, Alert, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// interface Props {
//     {}: Props
// }

function Dashboard(): ReactElement {
	const [error, setError] = useState<string>("");
	const { currentUser, logout } = useAuth();
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
		<>
			<Card>
				<Card.Body>
					<h2 className="text-center mb-4">Dashboard</h2>
					{error && <Alert variant="danger">{error}</Alert>}
					<strong>Email: </strong>
					{currentUser?.email}
					<strong>user: </strong>
					<pre>{JSON.stringify(currentUser, null, 2)}</pre>
					<Link to="/updateprofile" className="btn btn-primary w-100 mt-3">
						Update Profile
					</Link>
				</Card.Body>
			</Card>
			<div className="w-100 text-center mt-2">
				<Button variant="link" onClick={handleLogout}>
					Logout
				</Button>
			</div>
		</>
	);
}

export default Dashboard;
