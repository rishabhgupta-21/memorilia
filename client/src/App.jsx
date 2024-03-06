import React, { useEffect, useState } from "react";

// Components
import ShowAllMemoryCapsules from "./components/memoryCapsules/ShowAllMemoryCapsules";
import NewMemoryCapsuleForm from "./components/memoryCapsules/NewMemoryCapsuleForm";

function App() {
	return (
		<div>
			{/* <ShowAllMemoryCapsules /> */}
			<NewMemoryCapsuleForm />
		</div>
	);
}

export default App;
