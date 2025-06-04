// let the user know the script started
console.log("Starting tutorial script 1");

let playbackAvailable = true; // cooldown flag

nnApi.controlInputs.digital(1) // use pin 1 in digital mode, pins are numbered from 1
		.onChange((val) => {  // function to handle input value changes
			console.log(`Change on digital input 1 - current value: ${val}`); // log current input pin value
			if (val) { // if pin is high (true)...
				if (!playbackAvailable) {  // if cooldown is active, log and return
					console.log("Playback not available yet");
					return;
				}
				nnApi.pagingRouter.playLocalFile(  // cooldown ready, proceed to play local file
						{
							priority: 2,  // priority - the lower the number, the higher the priority
							audioFilePath: "sample.mp3", // file path
							outputs: ["out1"]   // list of router outputs the file will be played to
						}
				);
				console.log(`Playing local file test.mp3`); // let the user know the file is playing
				playbackAvailable = false;  // disable playback
				setTimeout( // re-enable playback after 60s cooldown
						() => {
							console.log("Playback available");
							playbackAvailable = true;
						},
						60000,
				);
			}
		});