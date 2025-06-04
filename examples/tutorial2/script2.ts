// let the user know the script started
console.log("Starting tutorial script 2");

let playbackAvailable = true;   // cooldown flag

nnApi.controlInputs.digital(1)  // use pin 1 in digital mode, pins are numbered from 1
		.onChange((val) => {    // function to handle input value changes
			console.log(`Change on digital input 1 - current value: ${val}`);   // log current input pin value
			if (val) {  // if pin is high (true)...
				if (!playbackAvailable) {   // if cooldown is active, log and return
					console.log("Playback not available yet");
					return;
				}
				nnApi.pagingRouter.playLocalFile(   // cooldown ready, proceed to play local file
						{
							priority: 2,    // priority - the lower the number, the higher the priority
							audioFilePath: "sample.mp3",    // file path
							outputs: ["out1"],  // list of router outputs the file will be played to
						},
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
				const variableValue = nnApi.system.variables.get("tutorial2");  // get our user-defined variable
				sendGetRequest(variableValue);  // send the variable value to the echo server
			}
		});

/**
 * Sends the variable value to the postman echo server as an HTTP query param.
 * @param variableValue The variable value to send as an HTTP query param
 */
async function sendGetRequest(variableValue: string) {
	try {
		const url =
				`https://postman-echo.com/get?variableValue=${variableValue}`;  // build our URL
		const response = await fetch(url, { // send the HTTP GET request
			method: "GET",
		});
		console.log("Response status:", response.status);   // log the response status
		response.text().then((text) => {    // log the response body
			console.log("Response body: ", text);
		});
	} catch (error) {
		console.log("Error in sendGetRequest:", error); // log any errors
	}
}