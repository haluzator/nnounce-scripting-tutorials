# Error handling and `try..catch` statement examples

## Introduction
In case the statements `throw` and `try...catch` are unknown concept to you, we recommend you start by reading some documents on it.
There is JavaScript reference available at Mozilla Developer Network -[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) and [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch), but there will be plenty other articles and tutorials on the internet.

## nnounce scripting and errors

### When does nnounce script throw errors?
Every time your script tries to read or set property of DSP component, there will be an error thrown if you try to manipulate non-existent component.
This includes times when you start your DSP-dependent script, but there is no DSP design running or when you inadvertently make a typo in a component name.
Or when the script is running and someone changes the design, so that the component is no longer present. 

There is also possibility that you throw error yourself somewhere in your script and forget to catch it.

More on DSP configuration and design editor can be found in the nnounce configuration guide at [https://docs.simpleway.cloud/nnounce/docs/designer-dsp-configuration](https://docs.simpleway.cloud/nnounce/docs/designer-dsp-configuration).

### What happens when error does not get caught?
The script will fail, crash and will be restarted. You will see the error in script logs with indication of line causing the error.

## Examples

1. Simple catch - we try to get Gain component mute state and catch the error for safety reasons
   ```typescript
    try {
        const isGainMute = nnApi.dsp.components.gain("Gain 1").isMute();
        nnApi.logger.info("Gain component 'Gain 1' muted: ", isGainMute);
    } catch (e) {
        nnApi.logger.error("Could not get mute state of component 'Gain 1' because of error: ", e);
    }   
   ```
2. Custom exception - we can use `try...catch` with custom exceptions for various purposes - validations, handling inconsistent state of our code and other.
   ```typescript
    function validateUserInput(input: string) {
        if (input.trim() === "") {
            throw new Error("Input cannot be empty");
        }
    }
    
   let userDefinedVar = nnApi.system.variables.get("user-defined-var");

    // Example of using try/catch
    try {    
        validateUserInput(""); // This might throw
        nnApi.logger.info("User-defined system variable validation passed");
    } catch (err) {    
        nnApi.logger.error(`User-defined system variable validation failed: ${err.message}`);
        // Fallback to default value
        userDefinedVar = "defaultValue";
    }

    // rest of the code...
    ```
3. Custom exception with javascript Promises - in case you are dealing with asynchronous code, you have two options how to catch errors thrown by async functions
    1. awaiting on a promise
       ```typescript       
       // Simulate async validation (e.g. API call) 
       async function validateUserInput(username: string): Promise<boolean> {
	        return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (username.trim() === "") {
                        reject(new Error("Input cannot be empty"));
                    } else {
                        resolve(); 				
                    }
                }, 500);
   		    });
       }
   	
       let userDefinedVar = nnApi.system.variables.get("user-defined-var");
        
       try {
            await validateUserInput(userDefinedVar); // This might reject
            nnApi.logger.info("User-defined system variable validation passed");
       } catch (err) {
            nnApi.logger.error(`User-defined system variable validation failed: ${err.message}`);
            // Fallback to default value
            userDefinedVar = "defaultValue";
       }
       
       // rest of the code...
       ```
   2. using `.then()` and `.catch()`
      ```typescript
      // Simulate async validation (e.g. API call)
      async function validateUserInput(username: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (username.trim() === "") {
                    reject(new Error("Input cannot be empty"));
                } else {
                    resolve();
                }
            }, 500);
        });
      }
      
      let userDefinedVar = nnApi.system.variables.get("user-defined-var");
      
      validateUserInput(userDefinedVar)
        .then(() => {
            nnApi.logger.info("User-defined system variable validation passed");
        })
        .catch((err) => {
            nnApi.logger.error(`User-defined system variable validation failed: ${err.message}`)
            // Fallback to default value
            userDefinedVar = "defaultValue";
        });
      
      // rest of the code
       ```
