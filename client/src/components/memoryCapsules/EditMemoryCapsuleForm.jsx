import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, addMinutes, isSameDay, isBefore, isAfter, isSameMinute, differenceInMinutes } from "date-fns";
import { memo } from "react";

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
			reqMemoryCapsule.dateOfCreation = new Date(reqMemoryCapsule.dateOfCreation);
			// Set the scheduledDateOfOpening to null as editing is only allowed after a capsule has opened!
			reqMemoryCapsule.scheduledDateOfOpening = null;
			// Update State
			setMemoryCapsule(reqMemoryCapsule);
		}
	}, [memoryCapsules, id]);

	// Utility Functions to handle client side validations
	function isValidScheduledDate(scheduledDateOfOpening) {
		if (!scheduledDateOfOpening || new Date(scheduledDateOfOpening) == "Invalid Date") {
			return false;
		}

		const comparingDate = addMinutes(new Date(), 30);
		if (!isAfter(scheduledDateOfOpening, comparingDate)) {
			return false;
		}

		return true;
	}

	function setMinDate() {
		const currentDate = new Date();
		const comparingDate = addMinutes(currentDate, 30);

		// console.log(`Current Date: ${currentDate}`);
		// console.log(`Comparing Date: ${comparingDate}`);

		if (isSameDay(currentDate, comparingDate)) {
			return currentDate;
		} else {
			return addDays(currentDate, 1);
		}
	}

	function filterPassedTime(time) {
		const currentDateTime = Date.now();
		const lastInvalidDateTime = addMinutes(currentDateTime, 30);

		// No Date selected yet - All times disabled
		if (!memoryCapsule.scheduledDateOfOpening) {
			return false;
		}
		// Current Date Selected
		else if (isSameDay(memoryCapsule.scheduledDateOfOpening, currentDateTime)) {
			// Passed times && current time disabled
			if (isBefore(time, currentDateTime) || isSameMinute(time, currentDateTime)) {
				return false;
			}
			// times 30 mins ahead disabled
			else if (isAfter(time, currentDateTime) && differenceInMinutes(time, currentDateTime) <= 30) {
				return false;
			}

			// All other times enabled
			return true;
		}
		// Next Day Selected
		else if (isSameDay(memo.scheduledDateOfOpening, addDays(currentDateTime, 1))) {
			// All times before lastInvalidDateTime disabled
			if (isBefore(time, lastInvalidDateTime) || isSameMinute(time, lastInvalidDateTime)) {
				return false;
			}

			// All other times enabled
			return true;
		}

		// Any other date selected - All times enabled
		return true;
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

		// We are only considering minutes
		date.setSeconds(0);

		setMemoryCapsule({
			...memoryCapsule,
			scheduledDateOfOpening: date,
		});
	}

	function handleFormSubmit(e) {
		e.preventDefault();
		if (!isValidScheduledDate(memoryCapsule.scheduledDateOfOpening)) {
			setMemoryCapsule({ ...memoryCapsule, scheduledDateOfOpening: null });
			alert("Please select a valid Scheduled Date of Opening (must be at least 30 minutes ahead of the current time).");
		} else {
			onUpdate(e, id, memoryCapsule);
		}
	}

	return (
		<>
			{memoryCapsule ? (
				<form onSubmit={(e) => handleFormSubmit(e)}>
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
						<label htmlFor='scheduledDateOfOpening'>Scheduled Date of Opening: </label>

						<DatePicker
							name='scheduledDateOfOpening'
							placeholderText='Select a Date and Time'
							selected={memoryCapsule.scheduledDateOfOpening}
							onChange={(date) => handleDateChange(date)}
							dateFormat='dd/MM/yyyy - hh:mm aa'
							minDate={setMinDate()}
							showTimeSelect
							filterTime={filterPassedTime}
							timeIntervals={5}
							timeCaption='Time'
							showIcon
							toggleCalendarOnIconClick
							closeOnScroll={true}
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
