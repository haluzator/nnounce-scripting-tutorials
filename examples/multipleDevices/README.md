# Managing multiple nnounce devices

## Introduction

This tutorial will show how to manage multiple nnounce devices from one script in Visual Studio Code. 
If you did not read it already, please consider starting with [snippets tutorial](../../snippets/README.md) as there is guide to setting up Visual Studio Code for nnounce scripting.
Sample VS Code workspace with script for managing multiple nnounce devices is included in [this folder](VSCode_workspace).

## Connecting to device
The connection is made asynchronously, but you can decide if you want to wait for the connection.
Every connected device needs to be assigned to separate variable. 

```typescript
// import the function used to connect to nnounce device
import { connectDevice } from "jsr:@nnounce/scripting-api";

// now you have two options, how to use the function: 

// OPTION 1
// this call connects to device asynchronously. 
// code execution continues and all the communication happens once the connection is established 
const device = connectDevice("hostnameOrIp", "apiKeyCanBeNull");

// OPTION 2
// this call blocks until the connection is established, then the rest of the code is executed
const device = await connectDevice("hostnameOrIp", "apiKeyCanBeNull").connectionPromise();

// rest of the code
```

Second parameter passed to `connectDevice()` function is used as a authentication token - you need to set it, if API key is required in remote device setting.
More on API keys can be found in the nnounce configuration guide at [https://docs.simpleway.cloud/nnounce/docs/device-control](https://docs.simpleway.cloud/nnounce/docs/device-control) and [https://docs.simpleway.cloud/nnounce/docs/users#set-api-key](https://docs.simpleway.cloud/nnounce/docs/users#set-api-key).

## Sample VS Code workspace
Sample workspace is prepared to connect to multiple nnounce devices.
