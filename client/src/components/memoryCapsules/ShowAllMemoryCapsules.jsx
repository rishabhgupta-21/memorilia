import React from "react";
import { Link } from "react-router-dom";

function ShowAllMemoryCapsules({ memoryCapsules }) {
	return (
		<>
			{memoryCapsules && memoryCapsules.length > 0 ? (
				<div>
					<h1>Memory Capsules</h1>
					{memoryCapsules.map((memoryCapsule) => {
						return (
							<div key={memoryCapsule._id}>
								<h2>{memoryCapsule.title}</h2>
								<p>{memoryCapsule.description}</p>

								<Link to={`/memoryCapsules/${memoryCapsule._id}`}>
									<button>Visit</button>
								</Link>
							</div>
						);
					})}
				</div>
			) : (
				<h1>Loading...</h1>
			)}
		</>
	);
}

export default ShowAllMemoryCapsules;
