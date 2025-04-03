// import modules we will need
import { nnControlInputs } from "nnControlInputs";  // lets us react to control input value change
import { nnPagingRouter } from "nnPagingRouter";    // lets us play local file
import { nnSystem } from "nnSystem";    // lets us access system variables

// let the user know the script started
console.log("Starting tutorial script 2");

let playbackAvailable = true;   // playback available flag

nnControlInputs.digital(1)  // use the pin 1 in digital mode, pins are numbered from 1
		.onChange((val) => {    // define function handling change of input value
			console.log(`Change on digital input 1 - current value: ${val}`);   // log current input pin value
			if (val) {  // if pin is high (means val is true)...
				if (!playbackAvailable) {   // if our playback is on cooldown, log it and return
					console.log("Playback not available yet");
					return;
				}
				nnPagingRouter.playLocalFile(   // cooldown ready, proceed to play local file
						{
							priority: 2,    // with priority 2 (the lower the number, the higher the priority)
							audioFilePath: "sample.mp3",    // path to file we want to play
							outputs: ["out1"],  // list of router outputs we want the file be played to
						},
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
				const variableValue = nnSystem.variables.get("tutorial2");  // get our user-defined variable
				sendGetRequest(variableValue);  // send the variable value to echo server
			}
		});

/**
 * Function that sends variable value to postman echo server as a HTTP query param.
 * @param variableValue Variable to be sent as HTTP query param
 */
async function sendGetRequest(variableValue: string) {
	try {
		const url =
				`https://postman-echo.com/get?variableValue=${variableValue}`;  // build our URL
		const response = await fetch(url, { // sand the HTTP GET request
			method: "GET",
		});
		console.log("Response status:", response.status);   // log response status
		response.text().then((text) => {    // log response body
			console.log("Response body: ", text);
		});
	} catch (error) {
		console.log("Error in sendGetRequest:", error); // in case of error, log it
	}
}