import React, { useEffect, useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";

// Components
import Home from "./components/Home";
import ShowAllMemoryCapsules from "./components/memoryCapsules/ShowAllMemoryCapsules";
import NewMemoryCapsuleForm from "./components/memoryCapsules/NewMemoryCapsuleForm";
import ShowMemoryCapsule from "./components/memoryCapsules/ShowMemoryCapsule";
import EditMemoryCapsuleForm from "./components/memoryCapsules/EditMemoryCapsuleForm";

function App() {
	// State for storing Memory Capsules (Backend Data)
	const [memoryCapsules, setMemoryCapsules] = useState([]);

	// Navigate Hook
	const navigate = useNavigate();

	// Fetching Data from Backend
	useEffect(() => {
		// Ignore the fetch when the component is unmounted
		let ignore = false;

		// Function for Fetch Memory Capsules
		async function fetchMemoryCapsules() {
			try {
				const response = await fetch("http://localhost:3000/memoryCapsules");
				if (response.status !== 200) {
					throw new Error("Error: Memory Capsules could not be found!");
				}

				const data = await response.json();

				// Convert Date Strings back to Date Objects for all Memory Capsules
				data.forEach((memoryCapsule) => {
					memoryCapsule.dateOfCreation = new Date(memoryCapsule.dateOfCreation);
					memoryCapsule.scheduledDateOfOpening = new Date(
						memoryCapsule.scheduledDateOfOpening
					);
				});

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

	// Event Handlers for Memory Capsules
	async function handleDelete(id) {
		try {
			// Delete Memory Capsule from Backend and Database
			const response = await fetch(
				`http://localhost:3000/memoryCapsules/${id}`,
				{
					method: "DELETE",
				}
			);

			if (response.status != 200) {
				throw new Error("Memory Capsule not deleted!");
			}

			const data = await response.json();
			console.log(data);

			// Update State
			const updatedMemoryCapsules = memoryCapsules.filter((memoryCapsule) => {
				return memoryCapsule._id != id;
			});
			setMemoryCapsules(updatedMemoryCapsules);

			// Navigate to ShowAllMemoryCapsules after successful deletion
			navigate("/memoryCapsules", {
				replace: true,
			});
		} catch (err) {
			console.log(err);
		}
	}

	async function handleCreate(e, formData) {
		try {
			e.preventDefault();
			// console.log(formData);

			// Create a new memory capsule
			const res = await fetch("http://localhost:3000/memoryCapsules", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (res.status !== 201) {
				throw new Error("Memory Capsule could not be created!");
			}

			const data = await res.json();
			console.log(data);

			// Update State
			const updatedMemoryCapsules = [...memoryCapsules, data];
			setMemoryCapsules(updatedMemoryCapsules);

			// Navigate to ShowMemoryCapsule after successful creation
			navigate(`/memoryCapsules/${data._id}`, {
				replace: true,
			});
		} catch (err) {
			console.log(err);
		}
	}

	async function handleUpdate(e, id, updatedMemoryCapsule) {
		try {
			e.preventDefault();
			// console.log(updatedMemoryCapsule);

			// Update this memory capsule
			const res = await fetch(`http://localhost:3000/memoryCapsules/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedMemoryCapsule),
			});

			if (res.status !== 200) {
				throw new Error("Memory Capsule could not be updated!");
			}

			const data = await res.json();
			console.log(data);

			// Update State
			const updatedMemoryCapsules = memoryCapsules.map((memoryCapsule) => {
				if (memoryCapsule._id === id) {
					return data;
				}
				return memoryCapsule;
			});
			setMemoryCapsules(updatedMemoryCapsules);

			// Navigate to ShowMemoryCapsule after successful update
			navigate(`/memoryCapsules/${id}`, {
				replace: true,
			});
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<>
			<nav>
				<ul>
					<li>
						<Link to='/'>Home</Link>
					</li>
					<li>
						<Link to='/memoryCapsules'>All Capsules</Link>
					</li>
					<li>
						<Link to='/memoryCapsules/new'>New Capsule</Link>
					</li>
				</ul>
			</nav>

			<Routes>
				{/* Home Route */}
				<Route
					path='/'
					element={<Home />}
				></Route>

				{/* MemoryCapsule Routes */}
				<Route path='/memoryCapsules'>
					{/* Index */}
					<Route
						index
						element={<ShowAllMemoryCapsules memoryCapsules={memoryCapsules} />}
					></Route>
					{/* Create */}
					<Route
						path='new'
						element={<NewMemoryCapsuleForm onCreate={handleCreate} />}
					></Route>
					{/* Show */}
					<Route
						path=':id'
						element={
							<ShowMemoryCapsule
								memoryCapsules={memoryCapsules}
								onDelete={handleDelete}
							/>
						}
					></Route>
					{/* Update */}
					<Route
						path='edit/:id'
						element={
							<EditMemoryCapsuleForm
								memoryCapsules={memoryCapsules}
								onUpdate={handleUpdate}
							/>
						}
					></Route>
				</Route>

				{/* Error Routes */}
				{/* <Route path='*' element={<NotFound />}></Route> */}
			</Routes>
		</>
	);
}

export default App;
