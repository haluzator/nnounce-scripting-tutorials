# Managing single nnounce device locally

## Introduction

This tutorial will show how to manage single nnounce device locally from Visual Studio Code.
If you did not read it already, please consider starting with [snippets tutorial](../../snippets/README.md) as there is guide to setting up Visual Studio Code for nnounce scripting.
Sample VS Code workspace with script for managing single nnounce device is included in [this folder](VSCode_workspace).

## Connecting to device
You have several options how to connect to device you want to manage.
The connection is made asynchronously, but you can decide if you want to wait for the connection.

### Connection using environment properties
When you set environment properties `HOSTNAME` and `API_KEY`, the code to connect and initialize the scripting looks like follows:

```typescript
// import the function used to connect to nnounce device
import { nnounceDevice } from "jsr:@nnounce/scripting-api";

// now you have two options, how to use the function: 

// OPTION 1
// this call connects to device asynchronously. 
// code execution continues and all the communication happens once the connection is established 
const device = nnounceDevice();

// OPTION 2
// this call blocks until the connection is established, then the rest of the code is executed
const device = await nnounceDevice().connectionPromise();

// rest of the code
```

The `nnounceDevice()` function reads environment properties and connects to device based on `HOSTNAME` and `API_KEY` variables values. 
If you leave `HOSTNAME` empty, default value `localhost` is used.
`API_KEY` is used as a authentication token - you need to set it, if API key is required in device setting.
More on API keys can be found in the nnounce configuration guide at [https://docs.simpleway.cloud/nnounce/docs/device-control](https://docs.simpleway.cloud/nnounce/docs/device-control) and [https://docs.simpleway.cloud/nnounce/docs/users#set-api-key](https://docs.simpleway.cloud/nnounce/docs/users#set-api-key).

#### Setting environment properties
You can set the environment properties' values in `.env` file. 
When you run Deno with `--env-file` argument, it will read the `.env` file from the current working directory or the first parent directory that contains one.

Other option is to modify launch configuration in `.vscode\launch.json` so it looks like this:
```json
{
    "version": "0.2.0",
    "configurations": [

        {
            "request": "launch",
            "name": "Launch Program",
            "type": "node",
            "program": "${workspaceFolder}/main.ts",
            "cwd": "${workspaceFolder}",
            "runtimeExecutable": "deno",
            "runtimeArgs": [
                "run",                
                "--import-map",
                "./import_map.json",
                "--inspect-wait",
                "--allow-env",
                "--allow-read",
                "--allow-net",
                "--reload",
                "--unsafely-ignore-certificate-errors",
				"--allow-import"
            ],
            "attachSimplePort": 9229,
            "env": {
                "HOSTNAME": "myHostname",
                "API_KEY": "apiKeyIfApplicable"
            }
        }
    ]
}
```

### Connection using function arguments
You dont have to set environment properties - you can specify the hostname and API key directly when connecting to device.
In that case, the code looks as follows:

```typescript
// import the function used to connect to nnounce device
import { connectDevice } from "jsr:@nnounce/scripting-api";;

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

## Sample VS Code workspace
Sample workspace is prepared to connect to nnounce device using the environment properties read by Deno runtime from `.env` file. 
Please fill in this file with your nnounce device hostname and API key if needed.
