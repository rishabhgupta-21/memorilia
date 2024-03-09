import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function ShowMemoryCapsule() {
	// State to hold memory capsule
	const [memoryCapsule, setMemoryCapsule] = useState({
		title: "",
		description: "",
		scheduledDateOfOpening: null,
	});

	// Get the id from the URL
	const { id } = useParams();

	// Navigate
	const navigate = useNavigate();

	// Fetching Data from Backend
	useEffect(() => {
		// Ignore the fetch when the component is unmounted
		let ignore = false;

		async function fetchMemoryCapsule() {
			try {
				const response = await fetch(
					`http://localhost:3000/memoryCapsules/${id}`
				);
				const data = await response.json();
				if (!ignore) {
					setMemoryCapsule({ ...data });
				}
			} catch (err) {
				console.log(err);
			}
		}

		// Call the Fetch Memory Capsules function
		fetchMemoryCapsule();

		// Cleanup Function
		return () => {
			ignore = true;
		};
	}, [id]);

	// Click Handler - Delete button
	async function handleClick(id) {
		try {
			const response = await fetch(
				`http://localhost:3000/memoryCapsules/${id}`,
				{
					method: "DELETE",
				}
			);

			if (response.status != 200) {
				throw new Error("Error: Memory Capsule not deleted!");
			}

			const data = await response.json();
			console.log(data);

			// Navigate to ShowAllMemoryCapsules
			navigate("/memoryCapsules", {
				replace: true,
			});
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div>
			{memoryCapsule ? (
				<>
					<h1>{memoryCapsule.title}</h1>
					<p>{memoryCapsule.description}</p>
					{/* Edit Button */}
					<Link to={`/memoryCapsules/edit/${memoryCapsule._id}`}>
						<button>Edit</button>
					</Link>
					{/* Delete Button */}
					<button onClick={() => handleClick(id)}>Delete</button>
				</>
			) : (
				<h1>Memory Capsule does not exist!</h1>
			)}
		</div>
	);
}

export default ShowMemoryCapsule;
