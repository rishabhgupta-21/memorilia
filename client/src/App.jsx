import React, { useEffect, useState } from "react";
import { Route, Routes, Link } from "react-router-dom";

// Components
import Home from "./components/Home";
import ShowAllMemoryCapsules from "./components/memoryCapsules/ShowAllMemoryCapsules";
import NewMemoryCapsuleForm from "./components/memoryCapsules/NewMemoryCapsuleForm";
import ShowMemoryCapsule from "./components/memoryCapsules/ShowMemoryCapsule";
import EditMemoryCapsuleForm from "./components/memoryCapsules/EditMemoryCapsuleForm";

function App() {
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
						element={<ShowAllMemoryCapsules />}
					></Route>
					{/* Create */}
					<Route
						path='new'
						element={<NewMemoryCapsuleForm />}
					></Route>
					{/* Show */}
					<Route
						path=':id'
						element={<ShowMemoryCapsule />}
					></Route>
					{/* Update */}
					<Route
						path='edit/:id'
						element={<EditMemoryCapsuleForm />}
					></Route>
				</Route>

				{/* Error Routes */}
				{/* <Route path='*' element={<NotFound />}></Route> */}
			</Routes>
		</>
	);
}

export default App;
