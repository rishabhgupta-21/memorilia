import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";

// 1. Should probably store the apppropriate timezone for the CLient's Browser too - might come in handy later for displaying things.
// 2. Having received the data from the server, we should update the Memory Capsules state by adding the new memory capsule to it.
// 3. Implement validity logic and error handling - think of all possible cases.

function EditMemoryCapsuleForm() {
	// State to hold memory capsule
	const [memoryCapsule, setMemoryCapsule] = useState({
		title: "",
		description: "",
		scheduledDateOfOpening: null,
	});

	// Get the id from the URL
	const { id } = useParams();

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
					console.log(data);
					setMemoryCapsule({
						...data,
						scheduledDateOfOpening: null,
					});
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

	// Function to check validity
	function isScheduledDateValid() {}

	// Function to handle form submission
	function handleSubmit(e) {
		e.preventDefault();
		// console.log(formData);
		// console.log(scheduledDateOfOpening);

		// Update memory capsule
		async function updateMemoryCapsule() {
			try {
				// Send PUT request to update this memory capsule
				const res = await fetch(`http://localhost:3000/memoryCapsules/${id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(memoryCapsule),
				});

				const data = await res.json();
				return data;
			} catch (err) {
				setMemoryCapsule(null);
				console.error(err);
			}
		}

		// const memoryCapsule = await createMemoryCapsule();
		updateMemoryCapsule()
			.then((data) => console.log(data))
			.catch((err) => console.error(err));

		// NOW, UPDATE THIS IN THE EXISTING MEMORY CAPSULES STATE!!!
	}

	// Functions to handle input changes
	function handleFormChange(e) {
		// console.log(e.target.name, e.target.value);
		setMemoryCapsule({
			...memoryCapsule,
			[e.target.name]: e.target.value,
		});
	}

	function handleDateChange(date) {
		console.log(date);
		// console.log(date.getTimezoneOffset());
		setMemoryCapsule({
			...memoryCapsule,
			scheduledDateOfOpening: date,
		});
	}

	return (
		<form onSubmit={handleSubmit}>
			{/* Title */}
			<div>
				<label htmlFor='title'>Title: </label>
				<input
					type='text'
					name='title'
					value={memoryCapsule.title}
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
					value={memoryCapsule.description}
					onChange={handleFormChange}
					cols='30'
					rows='5'
					required
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
					selected={memoryCapsule.scheduledDateOfOpening}
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
					required
				/>
			</div>

			<br />
			<button>Update Memory Capsule</button>
		</form>
	);
}

export default EditMemoryCapsuleForm;
