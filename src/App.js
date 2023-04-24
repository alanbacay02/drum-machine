import './App.css';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

// Creates an array to store audio file paths.
const AUDIO_FILES = [
	'./soundpad/Heater-1.mp3', // Heater 1
	'./soundpad/Heater-2.mp3', // Heater 2
	'./soundpad/Heater-3.mp3', // Heater 3
	'./soundpad/Heater-4_1.mp3', // Heater 4
	'./soundpad/Heater-6.mp3', // Clap
	'./soundpad/Dsc_Oh.mp3', // Open-HH
	'./soundpad/Kick_n_Hat.mp3', // Kick-n'-Hat
	'./soundpad/RP4_KICK_1.mp3', // Kick
	'./soundpad/Cev_H2.mp3',  // Closed-HH
];

function SoundButton({ handleClick, name, id }) {
	return (
		<div>
			<button 
				id={id}
				onClick={handleClick}
				className="h-14 w-16 rounded-md focus:outline-none active:bg-red-500 text-white bg-gray-400"
			>{name}</button>
		</div>
	);
}
SoundButton.propTypes = {
	handleClick: PropTypes.func.isRequired,
	name: PropTypes.string,
	id: PropTypes.string.isRequired
};

function SoundPad({ handleClick }) {
	const buttonNames = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
	const soundButtonArr = buttonNames.map((name, index) => {
		return (
			<SoundButton id={`soundButton${index}`} key={index} handleClick={() => {handleClick(index);}} name={name}/>
		);
	});

	return (
		<div className="grid grid-cols-3 gap-2 max-w-[290px] mx-auto p-4">
			{soundButtonArr}
		</div>
	);
}
SoundPad.propTypes = {
	handleClick: PropTypes.func.isRequired
};

export default function App() {
	// Maps over `AUDIO_FILES` array and creates new audio object using `new Audio` constructor.
	const audio = AUDIO_FILES.map(filename => new Audio(filename));
	// Creates an array `audioKeys` that will be used to match a keydown event to its corresponding button.
	const audioKeys = ['q','w','e','a','s','d','z','x','c'];

	// Creates an Event listener on component mount that will be used to track keydown events.
	useEffect(() => {
		// Creates a function that will handle a keydown event.
		const handleKeyDown = (event) => {
			// Maps over the `audioKeys` array and gets both the `key` and its `index`.
			audioKeys.map((key, index) => {
				if (event.key === key) {
					//const button = document.querySelectorAll('button')[index];
					// Assigns to `button` the corresponding button that matches the keydown event.
					const button = document.getElementById(`soundButton${index}`);
					// Returns a button and clicks it.
					return button.click();
				}
			});
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};

	}, []);


	// Creates a function that will play audio when a sound button is clicked.
	function handleClick(index) {
		// Gets the audio file being played and resets its play duration to 0.
		audio[index].currentTime = 0;
		// Playes the audio file located in the `audio` array associated with the index.
		audio[index].play();
	}
	return (
		<div className="App">
			<SoundPad handleClick={handleClick} />
		</div>
	);
}
