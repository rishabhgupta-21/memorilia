import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function ShowMemoryCapsule({ memoryCapsules, onDelete }) {
	// State to hold memory capsule
	const [memoryCapsule, setMemoryCapsule] = useState(null);

	// Get the id from the URL
	const { id } = useParams();

	// Setting State from memoryCapsules Prop
	useEffect(() => {
		const reqMemoryCapsule = memoryCapsules.find((capsule) => {
			return capsule._id == id;
		});

		if (reqMemoryCapsule) {
			// Convert Date Strings back to Date Objects
			reqMemoryCapsule.dateOfCreation = new Date(
				reqMemoryCapsule.dateOfCreation
			);
			reqMemoryCapsule.scheduledDateOfOpening = new Date(
				reqMemoryCapsule.scheduledDateOfOpening
			);

			// Update State
			setMemoryCapsule(reqMemoryCapsule);
		}
	}, [memoryCapsules, id]);

	return (
		<div>
			{memoryCapsule ? (
				<>
					<h1>{memoryCapsule.title}</h1>
					<h2>{memoryCapsule.description}</h2>

					<p>
						<b>Created on</b>{" "}
						{memoryCapsule.dateOfCreation.toLocaleDateString()} <b>at</b>{" "}
						{memoryCapsule.dateOfCreation.toLocaleTimeString()}
					</p>
					<p>
						<b>Opens on</b>{" "}
						{memoryCapsule.scheduledDateOfOpening.toLocaleDateString()}{" "}
						<b>at</b>{" "}
						{memoryCapsule.scheduledDateOfOpening.toLocaleTimeString()}
					</p>
					{/* Edit Button */}
					<Link to={`/memoryCapsules/edit/${memoryCapsule._id}`}>
						<button>Edit</button>
					</Link>
					{/* Delete Button */}
					<button onClick={() => onDelete(id)}>Delete</button>
				</>
			) : (
				<h1>Memory Capsule does not exist!</h1>
			)}
		</div>
	);
}

export default ShowMemoryCapsule;
