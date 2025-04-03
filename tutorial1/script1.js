// import modules we will need
import { nnControlInputs } from "nnControlInputs"; // lets us react to control input value change
import { nnPagingRouter } from "nnPagingRouter"; // lets us play local file

// let the user know the script started
console.log("Starting tutorial script 1");

let playbackAvailable = true; // playback available flag

nnControlInputs.digital(1) // use the pin 1 in digital mode, pins are numbered from 1
		.onChange((val) => {  // define function handling change of input value
			console.log(`Change on digital input 1 - current value: ${val}`); // log current input pin value
			if (val) { // if pin is high (means val is true)...
				if (!playbackAvailable) {  // if our playback is on cooldown, log it and return
					console.log("Playback not available yet");
					return;
				}
				nnPagingRouter.playLocalFile(  // cooldown ready, proceed to play local file
						{
							priority: 2,  // with priority 2 (the lower the number, the higher the priority)
							audioFilePath: "sample.mp3", // path to file we want to play
							outputs: ["out1"]   // list of router outputs we want the file be played to
						}
				);
				console.log(`Playing local file test.mp3`); // let the user know the file is playing
				playbackAvailable = false;  // set our playback avaialable flag to false...
				setTimeout( // ...and start our cooldown, which will make the playback available in one minute
						() => {
							console.log("Playback available");
							playbackAvailable = true;
						},
						60000,
				);
			}
		});