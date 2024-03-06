import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";

// 1. Should probably store the apppropriate timezone for the CLient's Browser too - might come in handy later for displaying things.
// 2. Having received the data from the server, we should update the Memory Capsules state by adding the new memory capsule to it.
// 3. Implement validity logic and error handling - think of all possible cases.

function NewMemoryCapsuleForm() {
	// State to hold form data
	const [formData, setFormData] = React.useState({
		title: "",
		description: "",
	});

	// State to hold date from react-datepicker
	const [scheduledDateOfOpening, setScheduledDateOfOpening] = useState(null);

	// Function to check validity
	function isScheduledDateValid() {}

	// Function to handle form submission
	function handleSubmit(e) {
		e.preventDefault();
		// console.log(formData);
		// console.log(scheduledDateOfOpening);

		// Create a new memory capsule
		async function createMemoryCapsule() {
			try {
				// Send POST request to create new memory capsule
				const res = await fetch("http://localhost:3000/memoryCapsules", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...formData,
						scheduledDateOfOpening,
					}),
				});

				const data = await res.json();
				return data;
			} catch (err) {
				console.error(err);
			}
		}

		// const memoryCapsule = await createMemoryCapsule();
		createMemoryCapsule()
			.then((data) => console.log(data))
			.catch((err) => console.error(err));

		// NOW, ADD THIS TO THE EXISTING MEMORY CAPSULES STATE!!!
	}

	// Functions to handle input changes
	function handleFormChange(e) {
		// console.log(e.target.name, e.target.value);
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	}

	function handleDateChange(date) {
		console.log(date);
		// console.log(date.getTimezoneOffset());
		setScheduledDateOfOpening(date);
	}

	return (
		<form onSubmit={handleSubmit}>
			{/* Title */}
			<div>
				<label htmlFor='title'>Title: </label>
				<input
					type='text'
					name='title'
					value={formData.title}
					onChange={handleFormChange}
					required
				/>
			</div>

			{/* Description */}
			<br />
			<div>
				<label htmlFor='description'>Description: </label>
				<textarea
					name='description'
					value={formData.description}
					onChange={handleFormChange}
					cols='30'
					rows='5'
				></textarea>
			</div>

			{/* ScheduledDateOfOpening */}
			<br />
			<div>
				<label htmlFor='scheduledDateOfOpening'>
					Scheduled Date of Opening:{" "}
				</label>

				<DatePicker
					name='scheduledDateOfOpening'
					showIcon
					toggleCalendarOnIconClick
					closeOnScroll={true}
					selected={scheduledDateOfOpening || null}
					onChange={(date) => handleDateChange(date)}
					minDate={addDays(new Date(), 1)}
					placeholderText='DD/MM/YYYY - hh:mm aa'
					showTimeSelect
					// minTime={scheduledDateOfOpening && getDateInUTC(scheduledDateOfOpening) === getDateInUTC(new Date()) ? new Date() : null}
					// minTime={
					// 	scheduledDateOfOpening && (next-Day)
					// 		? new Date()
					// 		: setHours(setMinutes(new Date(), 0), 0)
					// }
					// maxTime={setHours(setMinutes(new Date(), 59), 23)}
					timeIntervals={15}
					timeCaption='Time'
				/>
			</div>

			<br />
			<button>Create Memory Capsule</button>
		</form>
	);
}

export default NewMemoryCapsuleForm;
