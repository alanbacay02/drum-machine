import './App.css';
import { useState, useEffect } from 'react';
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

// Creates a `SoundButton` component with passed in props `handleClick` which is a function, `name` which is a string, `id` which is an string, and `isActive` which is a bool.
function SoundButton({ handleClick, name, id, isActive }) {
	return (
		// Returns a <div> with a <button> element inside it.
		<div className="m-0 p-0">
			<button 
				id={id}
				onClick={handleClick}
				className={`h-[88px] w-[88px] rounded-2xl focus:outline-none active:bg-red-500 text-white ${isActive ? 'bg-red-500' : 'bg-sky-950'}`}
			>{name}</button>
		</div>
	);
}
// Validates props for `SoundButton` where `handleClick` is required a function, `name` is a string, `id` is required a string, and `isActive` is required a boolean value.
SoundButton.propTypes = {
	handleClick: PropTypes.func.isRequired,
	name: PropTypes.string,
	id: PropTypes.string.isRequired,
	isActive: PropTypes.bool.isRequired
};

// Creates a component `SoundPad` with passed in props `handleClick` which is a function, `activeButtonIndex` which is an integer, and `instName` which is a string.
function SoundPad({ handleClick, activeButtonIndex, instName }) {
	// Creates an array `buttonNames` used to display text for each of our buttons.
	const buttonNames = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
	// Creates a new array `soundButtonArr` by mapping over `buttonNames` array.
	const soundButtonArr = buttonNames.map((name, index) => {
		// Assigns a boolean value to `isActive` depending if `activeButtonIndex` and `index` are equal to each other.
		const isActive = index === activeButtonIndex;
		return (
			// Returns a child element `SoundButton` with a unique id, key, and name assigned to it. Props `handleClick` and `isActive` is also passed to it.
			<SoundButton id={`soundButton${index}`} key={index} name={name} handleClick={() => {handleClick(index);}} isActive={isActive}/>
		);
	});

	return (
		// Returns a <div> with an array `soundButtonArr`.
		<div className="flex flex-col gap-y-4 max-w-[300px] py-4 mx-auto mt-28 bg-blue-400 rounded-xl">
			<div className="grid grid-cols-3 gap-[6px] mx-auto">
				{soundButtonArr}
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
// Validates props for `SoundPad` where `handleClick` is required a function, `activeButtonIndex` is a number, and `instName` is a string.
SoundPad.propTypes = {
	handleClick: PropTypes.func.isRequired,
	activeButtonIndex: PropTypes.number,
	instName: PropTypes.string
};

export default function App() {
	// Creates state `activeButtonIndex` to track whenever a button is pressed or not.
	const [activeButtonIndex, setActiveButtonIndex] = useState(false);
	// Creates state `instName` to track name of instrument being played.
	const [instName, setInstName] = useState('');
	// Maps over `AUDIO_FILES` array and creates new audio object using `new Audio` constructor.
	const audio = AUDIO_FILES.map(object => new Audio(object.fileName));
	// Creates an object `audioMap` that will be used to match a keydown event to its corresponding button.
	const audioMap = {
		'q': './soundpad/Heater-1.mp3',
		'w': './soundpad/Heater-2.mp3',
		'e': './soundpad/Heater-3.mp3',
		'a': './soundpad/Heater-4_1.mp3',
		's': './soundpad/Heater-6.mp3',
		'd': './soundpad/Dsc_Oh.mp3',
		'z': './soundpad/Kick_n_Hat.mp3',
		'x': './soundpad/RP4_KICK_1.mp3',
		'c': './soundpad/Cev_H2.mp3'
	};
	// const audioKeys = ['q','w','e','a','s','d','z','x','c'];

	// Creates an Event listener on app initialization that will be used to track keydown events.
	useEffect(() => {
		const keys = {}; 
		// Adds an event listener to the document that listens for keydown events.
		const handleKeyDown = (event) => {
			const key = event.key.toLowerCase();
			keys[key] = true;
			playSounds(keys);
		};
		const handleKeyUp = (event) => {
			const key = event.key.toLowerCase();
			delete keys[key];
		};
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keydown', handleKeyUp);
		return () => {
			// Removes the event listeners when the component unmounts to prevent a memory leak.
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};

	}, []);

	function playSounds(keys) {
		for (let key in keys) {
			if (Object.prototype.hasOwnProperty.call(audioMap, key)) {
				const audio = new Audio(audioMap[key]);
				audio.play();
			}
		}
	}

	// Creates a function that will play audio when a sound button is clicked.
	function handleClick(index) {
		// Gets the audio file being played and resets its play duration to 0.
		audio[index].currentTime = 0;
		// Plays the audio file located in the `audio` array associated with the index.
		audio[index].play();
		// Sets `instName` state to name of instrument being played.
		setInstName(AUDIO_FILES[index]['instName']);
	}

	// Returns a div `App` with child element `SoundPad` with passed in props `handleClick` which is a function, `activeButtonIndex` which is an integer and `instName` which is a string.
	return (
		<div className="App">
			<SoundPad handleClick={handleClick} activeButtonIndex={activeButtonIndex} instName={instName}/>
		</div>
	);
}