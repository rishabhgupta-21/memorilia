import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";

// 1. Should probably store the apppropriate timezone for the CLient's Browser too - might come in handy later for displaying things.
// 2. Implement validity logic and error handling - think of all possible cases.

function NewMemoryCapsuleForm({ onCreate }) {
	// State to hold form data
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		scheduledDateOfOpening: null,
	});

	// Function to check validity
	function isScheduledDateValid() {}

	// Functions to handle input changes
	function handleFormChange(e) {
		// console.log(e.target.name, e.target.value);
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	}

	function handleDateChange(date) {
		// console.log(date);
		// console.log(date.getTimezoneOffset());
		setFormData({
			...formData,
			scheduledDateOfOpening: date,
		});
	}

	return (
		<form onSubmit={(e) => onCreate(e, formData)}>
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
					selected={formData.scheduledDateOfOpening}
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
			<button>Create Memory Capsule</button>
		</form>
	);
}

export default NewMemoryCapsuleForm;
