import './App.css';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faVolumeOff } from '@fortawesome/free-solid-svg-icons';

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
		<>
			<button 
				ref={buttonRefs}
				id={id}
				onClick={handleClick}
				className="drum-pad text-black h-[75px] w-[75px] md:h-[96px] md:w-[96px] rounded-xl focus:outline-none bg-gray-100 transition-all duration-100"
			>{name}</button>
		</>
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

// Creates a component `SoundPad` with passed in props `handleClick` which is a function, `activeButtonIndex` which is an integer, and `buttonRefs` which is a string.
function SoundPad({ handleClick, buttonRefs}) {
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
		// Returns array `soundButtonArray`.
		<>
			{soundButtonArray}
		</>
	);
}
// Validates props for `SoundPad` where `handleClick` is required a function, `activeButtonIndex` is a number, and `buttonRefs` which is an object.
SoundPad.propTypes = {
	handleClick: PropTypes.func.isRequired,
	activeButtonIndex: PropTypes.number,
	buttonRefs: PropTypes.shape({
		current: PropTypes.arrayOf(PropTypes.object),
	}).isRequired,
};

// Creates a component `InstrumentNameDisplay` to display the name of the instrument being played with props `instName`.
function InstrumentNameDisplay({ instName }) {
	return (
		<>
			<p id="display" className="">{instName}</p>
		</>
	);
}
// Valiudates props for `InstrumentNameDisplay` where `instName` is a string.
InstrumentNameDisplay.propTypes = {
	instName: PropTypes.string
};

// Creates a component function `VolumeSlider` which creates a volume slider to control the audio volume of the app.
function VolumeSlider({ audioVolume, handleVolumeChange }) {
	// Returns a <div/> with an <input/> set to `range` where on change calls the function `handleVolumeChange` from props. Initial volume of slider is set to value from props `audioVolume`.
	return (
		<div className="flex flex-row gap-x-2">
			<FontAwesomeIcon icon={faVolumeOff} className="text-sm lg:rotate-90" />
			<input
				className="accent-[#FFFFFF] w-28"
				type="range"
				min={0}
				max={1}
				step={0.1}
				value={audioVolume}
				onChange={(event) => handleVolumeChange(event)}>
			</input>
			<FontAwesomeIcon icon={faVolumeHigh} className="text-sm lg:rotate-90" />
		</div>
	);
}
// Validates props for `VolumeSlider` where `audioVolume` is a number and `handleVolumeChange` is a function.
VolumeSlider.propTypes = {
	audioVolume: PropTypes.number,
	handleVolumeChange: PropTypes.func.isRequired
};

// Creates a component function `ControlPanel` to store the power button of the app 
function ControlPanel({ handlePowerButtonClick, isAppOn }) {
	// Returns a button which calls `handlePowerButtonClick` function `onClick`.
	return (
		<>
			<button
				id={`${isAppOn ? 'power-button-on' : 'power-button-off'}`}
				className="flex mx-auto px-[13px] py-[13px] lg:px-[16px] lg:py-[16px] rounded-full focus:outline-none transition-all duration-100"
				onClick={handlePowerButtonClick}
			></button>
			<p className="pt-2 pl-2">Power</p>
		</>
	);
}
// Validates props for `ControlPanel` where `handlePowerButtonClick` is a function and `isAppOn` is a bool.
ControlPanel.propTypes = {
	handlePowerButtonClick: PropTypes.func.isRequired,
	isAppOn: PropTypes.bool.isRequired
};

export default function App() {
	// Creates state `instName` to track name of instrument being played.
	const [instName, setInstName] = useState('');
	// Creates state `volume` to track volume level of app.
	const [audioVolume, setAudioVolume] = useState(0.5);
	// Creates state `isAppOn` to track power state of app.
	const [isAppOn, setIsAppOn] = useState(true);

	// Creates a ref to track an array of 9 button elements.
	const buttonRefs = useRef([]);
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
		audio.forEach((audioFile) => {
			audioFile.volume = audioVolume;
		});
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
	}, [audioVolume, isAppOn]);

	// Helper function that plays audio files based on the keys stored in `pressedKeys`.
	function playSounds(pressedKeys) {
		// Iterates through the `pressedKeys` object
		for (let key in pressedKeys) {
			// Checks if `audioMap` object has the key from `pressedKeys`.
			if (Object.prototype.hasOwnProperty.call(audioMap, key)) {
				// Stores the integer value of the `key` in `pressedKeys` to `keyIndex`.
				let keyIndex = pressedKeys[key];
				// Calls function `playAudio` to play the respective audio file based on `keyIndex`.
				playAudio(keyIndex);
			}
		}
	}

	// Creates a function `handleVolumeChange` that is called when the volume slider value in `VolumeSlider` changes.
	function handleVolumeChange(event) {
		// Sets `audioVolume` state to the event value number.
		setAudioVolume(event.target.valueAsNumber);
	}

	// Creates function `playAudio` that plays a respective audio file based on the supplied `index` `onClick` or on `keydown` event.
	function playAudio(audioIndex) {
		if (!isAppOn) {
			// Returns function `activateButton` early when `isAppOn` is set to false.
			return activateButton(audioIndex);
		}
		// Gets the audio file being played and resets its play duration to 0.
		audio[audioIndex].currentTime = 0;
		// Assigns `audioVolume` state to the volume level of the audio file.
		audio[audioIndex].volume = audioVolume;
		// Plays the audio file located in the `audio` array associated with the index.
		audio[audioIndex].play();
		// Calls `activateButton` to handle active button states.
		activateButton(audioIndex);
		// Sets `instName` state to name of instrument being played.
		setInstName(AUDIO_FILES[audioIndex]['instName']);
	}

	// Creates function `handlePowerButtonClick` that will turn on or off the app `onClick`.
	function handlePowerButtonClick() {
		setIsAppOn(!isAppOn);
		setInstName('');
	}

	// Helper function that updates the references of the buttons.
	function activateButton(buttonIndex) {
		// Gets the reference of the button targeted.
		const buttonTarget = buttonRefs.current[buttonIndex];
		// Adds an `active` or `active-off` attribute to the `classList` of the button depending on the value of `isAppOn`.
		buttonTarget.classList.add(isAppOn ? 'active' : 'active-off');
		setTimeout(() => {
			// Removes the `active` or `active-off` attribute from `className` after 100ms.
			buttonTarget.classList.remove(isAppOn ? 'active' : 'active-off');
		}, 130);
	}

	// Returns a div `App` with child element `SoundPad` with passed in props `handleClick` which is a function, `activeButtonIndex` which is an integer, `instName` which is a string, and `buttonRefs` which is an object.
	return (
		<>
			<div id="drum-machine" className="App flex flex-col gap-10 lg:flex-row mx-auto mt-[100px] py-8 rounded-lg text-white w-[300px] md:w-[440px] md:text-lg lg:w-[830px] lg:h-[450px] lg:py-4">
				<div id="soundpad" className="grid grid-cols-3 gap-4 m-auto h-auto">
					<SoundPad buttonRefs={buttonRefs} handleClick={playAudio}/>
				</div>
				<div className="flex flex-col gap-y-6 lg:gap-y-16 mx-auto lg:my-auto">
					<div className="flex flex-row justify-center">
						<div id={isAppOn ? 'text-display' : 'text-display-off'} className="flex w-[180px] h-[40px] md:w-[220px] md:h-[47px] lg:w-[260px] lg:h-[55px] rounded-sm justify-center items-center">
							<InstrumentNameDisplay instName={instName}/>
						</div>
					</div>
					<div className="flex flex-col justify-center gap-y-4 lg:gap-x-14 lg:flex-row">
						<div className="flex flex-row justify-center lg:-rotate-90 lg:w-[62px] lg:h-[112px]">
							<div className="my-auto">
								<VolumeSlider volume={audioVolume} handleVolumeChange={handleVolumeChange} />
							</div>
						</div>
						<div className="flex flex-row justify-center">
							<div className="my-auto">
								<ControlPanel  isAppOn={isAppOn} handlePowerButtonClick={handlePowerButtonClick} />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mx-auto mt-1 max-w-[300px] md:max-w-[440px] lg:max-w-[830px]">
				<p className="text-white text-right lg:text-lg">
					by <a className="font-bold hover:underline" href="https://github.com/alanbacay02" rel="noreferrer" target='_blank'>Alan</a>
				</p>
			</div>
		</>
	);
}