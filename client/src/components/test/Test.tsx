import React, { ReactElement } from "react";
import { usePersAuth } from "../../contexts/AuthContext";

interface Props {}

function Test({}: Props): ReactElement {
	const { user } = usePersAuth();

	return (
		<div>
			<h1>{document.cookie || "no acc token"}</h1>
		</div>
	);
}

export default Test;
