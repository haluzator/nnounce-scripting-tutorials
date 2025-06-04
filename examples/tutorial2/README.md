# Tutorial 2: Read system variable and send HTTP request when input pin is set high (on cooldown)

1. [Introduction](#introduction)
1. [Setting the variable](#setting-the-variable)
1. [Updating the script](#updating-the-script)
1. [Triggering the input](#triggering-the-input)

## Introduction
We strongly recommend going through the [first tutorial](../tutorial1/README.md) before this one. 

Although the principles from this tutorial are generally applicable to other devices, we will continue using the script from the previous tutorial.

When the script from the [previous tutorial](../tutorial1/README.md) triggers, we will add some extra steps:
- read a user-defined variable
- send its value to an echo server via HTTP request.

To achieve this, we need to complete the following steps:
1. Set the variable
2. Update the script

Then we will trigger the script as before.

## Setting the variable
1. Navigate to the **Variables** tab
2. Click the **+** button
3. Fill in variable name and value. We will create a variable named `tutorial2` with the value `it just works`.
4. Click the **Save changes** button

You should now see your variable listed on the **Variables** tab.
![Variables tab with `tutorial2` file](../../img/examples/tutorial2/variables.png)

More details on variables can be found in the nnounce configuration guide at [https://docs.simpleway.cloud/nnounce/docs/variables](https://docs.simpleway.cloud/nnounce/docs/variables).

## Updating the script
Now that we have our variable set, we can update the background script from the [previous tutorial](/README.md).

1. Navigate to the **Scripting** tab
2. Click on saved script
3. Paste code below
```typescript
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
```
4. Click the **Save & Exit** button

More details on scripting can be found in the nnounce configuration guide at [https://docs.simpleway.cloud/nnounce/docs/scripting](https://docs.simpleway.cloud/nnounce/docs/scripting).

## Triggering the input

By now, you should already know how to trigger the updated script. If not, refer to the [first tutorial](../tutorial1/README.md#triggering-the-input).

---

This tutorial covered variable definition and script modification to retrieve user-defined variable and send its value to echo server via HTTP request. Happy coding!