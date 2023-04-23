import './App.css';
//import { useState } from 'react';
import PropTypes from 'prop-types';

function SoundButton({ handleClick, name }) {
	return (
		<div>
			<button 
				onClick={handleClick}
				className="h-14 w-16 rounded-md text-white bg-gray-400"
			>{name}</button>
		</div>
	);
}
SoundButton.propTypes = {
	handleClick: PropTypes.func.isRequired,
	name: PropTypes.string
};

function SoundPad({ handleClick }) {
	const buttonNames = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];

	const soundButtonArr = buttonNames.map((name, index) => {
		return (
			<SoundButton key={index} handleClick={handleClick} name={name}/>
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
	const audio = new Audio('./soundpad/Heater-1.mp3');

	function handleClick() {
		audio.currentTime = 0;
		audio.play();
	}

	return (
		<div className="App">
			<SoundPad handleClick={handleClick} />
		</div>
	);
}
