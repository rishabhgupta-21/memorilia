import React, { useState } from "react";

function ShowMemoryCapsule({ memoryCapsule }) {
	return (
		<div>
			<h1>{memoryCapsule.title}</h1>
			<p>{memoryCapsule.description}</p>
		</div>
	);
}

export default ShowMemoryCapsule;
