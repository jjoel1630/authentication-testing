import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthProvider, PersAuthProv } from "./contexts/AuthContext";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/ForgotPassword";
import UpdateProfile from "./components/UpdateProfile";
import HomePage from "./components/HomePage";
import Test from "./components/test/Test";
import TestSignup from "./components/test/TestSignup";

function App() {
	return (
		<Container
			className="d-flex align-items-center justify-content-center"
			style={{ minHeight: "100vh" }}>
			<div className="w-100" style={{ maxWidth: "400px" }}>
				<Router>
					<AuthProvider>
						<Switch>
							<Route exact path="/" component={HomePage} />
							<PrivateRoute path="/dashboard" component={Dashboard} />
							<PrivateRoute path="/updateprofile" component={UpdateProfile} />
							<Route path="/signup" component={Signup} />
							<Route path="/login" component={Login} />
							<Route path="/forgotpassword" component={ForgotPassword} />
						</Switch>
					</AuthProvider>
					<PersAuthProv>
						<Switch>
							<Route exact path="/test" component={Test} />
							<Route path="/test/signup" component={TestSignup} />
						</Switch>
					</PersAuthProv>
				</Router>
			</div>
		</Container>
	);
}

export default App;
