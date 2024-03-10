import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";

// 1. Should probably store the apppropriate timezone for the CLient's Browser too - might come in handy later for displaying things.
// 2. Implement validity logic and error handling - think of all possible cases.

function EditMemoryCapsuleForm({ memoryCapsules, onUpdate }) {
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
			// Convert Date String back to Date Object
			reqMemoryCapsule.dateOfCreation = new Date(
				reqMemoryCapsule.dateOfCreation
			);
			// Set the scheduledDateOfOpening to null as editing is only allowed after a capsule has opened!
			reqMemoryCapsule.scheduledDateOfOpening = null;
			// Update State
			setMemoryCapsule(reqMemoryCapsule);
		}
	}, [memoryCapsules, id]);

	// Function to check validity
	function isScheduledDateValid() {}

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
		<>
			{memoryCapsule ? (
				<form onSubmit={(e) => onUpdate(e, id, memoryCapsule)}>
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
			) : (
				<h1>Memory Capsule does not exist!</h1>
			)}
		</>
	);
}

export default EditMemoryCapsuleForm;
