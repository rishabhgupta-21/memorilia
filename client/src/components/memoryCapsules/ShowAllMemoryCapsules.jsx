import React, { useState, useEffect } from "react";

function ShowAllMemoryCapsules() {
	// State for storing Memory Capsules (Backend Data)
	const [memoryCapsules, setMemoryCapsules] = useState([]);

	// Fetching Data from Backend
	useEffect(() => {
		// Ignore the fetch when the component is unmounted
		let ignore = false;

		// Function for Fetch Memory Capsules
		async function fetchMemoryCapsules() {
			try {
				const response = await fetch("http://localhost:3000/memoryCapsules");
				const data = await response.json();
				if (!ignore) {
					setMemoryCapsules(data);
				}
			} catch (err) {
				console.log(err);
			}
		}

		// Call the Fetch Memory Capsules function
		fetchMemoryCapsules();

		// Cleanup Function
		return () => {
			ignore = true;
		};
	}, []);

	return (
		<div>
			{memoryCapsules && memoryCapsules.length > 0 ? (
				<div>
					<h1>Memory Capsules</h1>
					{memoryCapsules.map((memoryCapsule) => {
						return (
							<div key={memoryCapsule._id}>
								<h2>{memoryCapsule.title}</h2>
								<p>{memoryCapsule.description}</p>
							</div>
						);
					})}
				</div>
			) : (
				<h1>Loading...</h1>
			)}
		</div>
	);
}

export default ShowAllMemoryCapsules;
