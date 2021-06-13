import React, { ReactElement } from "react";
import { useHistory } from "react-router-dom";
import { usePersAuth } from "../../contexts/AuthContext";

interface Props {}

function TestSignup({}: Props): ReactElement {
	const { signup } = usePersAuth();
	const history = useHistory();

	return (
		<div>
			<button
				onClick={() => {
					signup("test1", "test1@123.com", "123");
					history.push("/test");
				}}>
				signup
			</button>
		</div>
	);
}

export default TestSignup;
