import './App.css';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Creates an array to store audio file paths and instrument names.
const AUDIO_FILES = [
	{ instName: 'Heater 1', fileName: './soundpad/Heater-1.mp3' },
	{ instName: 'Heater 2', fileName: './soundpad/Heater-2.mp3' },
	{ instName: 'Heater 3', fileName: './soundpad/Heater-3.mp3' },
	{ instName: 'Heater 4', fileName: './soundpad/Heater-4_1.mp3' },
	{ instName: 'Clap', fileName: './soundpad/Heater-6.mp3' },
	{ instName: 'Open High-hat', fileName: './soundpad/Dsc_Oh.mp3' },
	{ instName: 'Kick-n\'-Hat', fileName: './soundpad/Kick_n_Hat.mp3' },
	{ instName: 'Kick', fileName: './soundpad/RP4_KICK_1.mp3' },
	{ instName: 'Closed High-hat', fileName: './soundpad/Cev_H2.mp3' }
];

// Creates a `SoundButton` component with passed in props `handleClick` which is a function, `name` which is a string, `id` which is an string, `isActive` which is a bool, and `buttonRefs` which is a function.
function SoundButton({ handleClick, name, id, buttonRefs}) {
	return (
		// Returns a <div> with a <button> element inside it.
		<div className="m-0 p-0">
			<button 
				ref={buttonRefs}
				id={id}
				onClick={handleClick}
				className={'h-[88px] w-[88px] rounded-2xl focus:outline-none bg-slate-800 transition-colors duration-100 text-white active:bg-red-500'}
			>{name}</button>
		</div>
	);
}
// Validates props for `SoundButton` where `handleClick` is required a function, `name` is a string, `id` is required a string, `isActive` is required a boolean value, and `buttonRefs` is a function.
SoundButton.propTypes = {
	handleClick: PropTypes.func.isRequired,
	name: PropTypes.string,
	id: PropTypes.string.isRequired,
	isActive: PropTypes.bool,
	buttonRefs: PropTypes.func
};

// Creates a component `SoundPad` with passed in props `handleClick` which is a function, `activeButtonIndex` which is an integer, `instName` which is a string, and `buttonRefs` which is a string.
function SoundPad({ handleClick, instName, buttonRefs}) {
	// Creates an array `buttonNames` used to display text for each of our buttons.
	const buttonNames = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
	// Creates a new array `soundButtonArray` by mapping over `buttonNames` array.
	const soundButtonArray = buttonNames.map((name, index) => {
		// Assigns a boolean value to `isActive` depending if `activeButtonIndex` and `index` are equal to each other.
		return (
		// Returns a child element `SoundButton` with a unique id, key, and name assigned to it. Props `handleClick`, `isActive` and `buttonRefs` is also passed to it.
		// `buttonRefs` passes a function that takes in the DOM element as an argument and assigns it to a `buttonRefs` object with `index` as the key.
			<SoundButton buttonRefs={(el) => (buttonRefs.current[index] = el)} id={`soundButton${index}`} key={index} name={name} handleClick={() => {handleClick(index);}}/>
		);
	});

	return (
		// Returns a <div> with an array `soundButtonArray`.
		<div className="flex flex-col gap-y-4 max-w-[300px] py-4 mx-auto mt-28 bg-blue-400 rounded-xl">
			<div className="grid grid-cols-3 gap-[6px] mx-auto">
				{soundButtonArray}
			</div>
			<div className="flex flex-row justify-center">
				{/* Include Text Area Here!*/}
				<div className="w-[180px] h-[30px] bg-black text-center text-white my-auto">{instName}</div>
			</div>
			<div className="flex flex-row justify-center">
				{/* Include Volume Slider Here!*/}
				<div className="px-[60px] py-[2px] bg-black text-white">Volume Slider Here</div>
			</div>
			<div className="flex flex-row justify-center">
				{/* Include Buttons Here!*/}
				<div className="px-[60px] py-[2px] bg-black text-white">Buttons here!</div>
			</div>
		</div>
	);
}
// Validates props for `SoundPad` where `handleClick` is required a function, `activeButtonIndex` is a number, `instName` is a string, and `buttonRefs` which is an object.
SoundPad.propTypes = {
	handleClick: PropTypes.func.isRequired,
	activeButtonIndex: PropTypes.number,
	instName: PropTypes.string,
	buttonRefs: PropTypes.shape({
		current: PropTypes.arrayOf(PropTypes.object),
	}).isRequired,
};

export default function App() {
	// Creates a ref to track an array of 9 button elements.
	const buttonRefs = useRef([]);
	// Creates state `instName` to track name of instrument being played.
	const [instName, setInstName] = useState('');
	// Maps over `AUDIO_FILES` array and creates new audio object using `new Audio` constructor.
	const audio = AUDIO_FILES.map(object => new Audio(object.fileName));
	// Creates an object `audioMap` that will be used to match a keydown event to its corresponding button.
	const audioMap = {
		'q': 0,
		'w': 1,
		'e': 2,
		'a': 3,
		's': 4,
		'd': 5,
		'z': 6,
		'x': 7,
		'c': 8
	};

	// Creates an Event listener on app initialization that will be used to track keydown events.
	useEffect(() => {
		// Creates an object `pressedKeys` to track key events.
		const pressedKeys = {}; 
		// Adds an event listener to the document that listens for keydown events.
		const handleKeyDown = (event) => {
			// Gets the event key and assigns it to `key`.
			const key = event.key.toLowerCase();
			// Adds the key to `pressedKeys` with its respective index from `audioMap` as its value.
			pressedKeys[key] = audioMap[key];
			// Calls the `playSounds` function with the `pressedKeys` object.
			playSounds(pressedKeys);
		};
		// Adds an event listener to the document that listens for keydup events.
		const handleKeyUp = (event) => {
			// Gets the event key and assigns it to `key`.
			const key = event.key.toLowerCase();
			// Deletes the key from the `pressedKeys` object.
			delete pressedKeys[key];
		};
		// Adds `keydown` and `keyup` event listeners to the document where functions `handleKeyDown` and `handleKeyUp` are triggered when their respective events occur.
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keydown', handleKeyUp);
		return () => {
			// Removes the event listeners when the component unmounts to prevent a memory leak.
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	// Helper function that plays audio files based on the keys stored in `pressedKeys`.
	function playSounds(pressedKeys) {
		// Iterates through the `pressedKeys` object
		for (let key in pressedKeys) {
			// Checks if `audioMap` object has the key from `pressedKeys`.
			if (Object.prototype.hasOwnProperty.call(audioMap, key)) {
				// Stores the integer value of the `key` in `pressedKeys` to `keyIndex`.
				let keyIndex = pressedKeys[key];
				// Calls `playAudio` to play the respective audio file based on the value supplied by `keyIndex`.
				playAudio(keyIndex);
				// Calls `activateButton` to handle active button states.
				activateButton(keyIndex);
				// Sets `instName` state to respective `instName` of audio file from `AUDIO_FILES`.
				setInstName(AUDIO_FILES[keyIndex].instName);
			}
		}
	}
	
	// Creates a function that will play audio when a sound button is clicked.
	function handleClick(index) {
		// Calls `playAudio` to play the respective audio file based on the value supplied by `index`.
		playAudio(index);
		// Sets `instName` state to name of instrument being played.
		setInstName(AUDIO_FILES[index]['instName']);
	}

	// Helper function `playAudio` that playes a respective audio file based on the supplied `index`.
	function playAudio(audioIndex) {
		// Gets the audio file being played and resets its play duration to 0.
		audio[audioIndex].currentTime = 0;
		// Plays the audio file located in the `audio` array associated with the index.
		audio[audioIndex].play();
	}

	// Helper function that updates the references of the buttons.
	function activateButton(buttonIndex) {
		// Gets the reference of the button targeted.
		const buttonTarget = buttonRefs.current[buttonIndex];
		// Adds an `active` attribute to the `className` of the button.
		buttonTarget.classList.add('active');
		setTimeout(() => {
			// Removes the `active` attribute from `className` after 100ms.
			buttonTarget.classList.remove('active');
		}, 150);
	}

	// Returns a div `App` with child element `SoundPad` with passed in props `handleClick` which is a function, `activeButtonIndex` which is an integer, `instName` which is a string, and `buttonRefs` which is an object.
	return (
		<div className="App">
			<SoundPad buttonRefs={buttonRefs} handleClick={handleClick} instName={instName}/>
		</div>
	);
}