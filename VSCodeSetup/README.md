# Tutorial 3: nnounce scripting from Visual Studio Code

1. [Introduction](#introduction)
2. [Setting up Visual Studio Code project](#setting-up-visual-studio-code-project)
3. [Project Structure](#project-structure)
4. [Troubleshooting](#troubleshooting)

## Introduction
Scripting on nnounce devices is available using Deno JavaScript runtime. Scripts are written in TypeScript. Using Visual Studio Code for nnounce scripting enables debugging the scripts.  

This tutorial is focused on Visual Studio Code, but using other IDEs is possible.

All sources are included in the [vsc_project](./vsc_project) folder.

This tutorial was tested with Deno version 2.2.6.

## Setting up Visual Studio Code project
To enable scripting on nnounce devices from Visual Studio Code, follow these steps:
1. Install Deno JavaScript runtime ([https://docs.deno.com/runtime/getting_started/installation/](https://docs.deno.com/runtime/getting_started/installation/))
2. Download and install Visual Studio Code ([https://code.visualstudio.com/download](https://code.visualstudio.com/download))
3. Install Deno extension for VS Code
   1. Go to **Extensions** tab and search for Deno
   2. Install extension  
   ![Deno extension installation](./img/install_deno.png)
4. Create folder for your scripting project and open it in VS Code  
   ![Open folder in VS Code](./img/open_dir.png)
5. Create the `.vscode/launch.json` file  or use tab **Run and Debug**  
   ![Create file .vscode/launch.json](./img/create_launch.png)
   Paste the configuration into `launch.json`, replacing placeholders in angle brackets as needed:
```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "request": "launch",
            "name": "Launch Program",
            "type": "node",
            "program": "${workspaceFolder}/app/main.ts",
            "cwd": "${workspaceFolder}",
            "runtimeExecutable": "<path to deno.exe>",
            "runtimeArgs": [
                "run",
                "--reload",
                "--inspect-wait",
                "--allow-env",
                "--allow-net",
                "--unsafely-ignore-certificate-errors",
                "--allow-import"
            ],
            "attachSimplePort": 9229
        }
    ]
}
```
Configuration parameters explained:
- `program`: path to main file which is executed during run
- `runtimeExecutable`: path to deno.exe file
- `runtimeArgs`: arguments passed to Deno executable
  - `-reload`: forces a fresh download of sources before execution
  - `-inspect-wait`: waits for a debugger (V8 Inspector Protocol) to connect before executing your code
  - `-allow-env`: allows access to environment variables
  - `-allow-net`: grants network access permission
  - `--unsafely-ignore-certificate-errors`: ignore certificate errors (nnounce devices use self-signed certificates)
  - `--allow-import`: allows import from non-"public good" registries
- `attachSimplePort`: specifies the debugging port
6. Create the `.vscode/settings.json` file
```json
{
     "deno.enable": true
}
```
7. Create the `app/main.ts` file
```typescript
import { connectDevice as ampnode4 } from "https://ampnode4-900094/script/api/nnounceConnector.ts";

const ampApi = await ampnode4("ampnode4-900094", "d56a9ab11ccda15c2ddf2570c3a492d4d33fd46229f114e1679713078244563e", true);
setInterval(() => {
    ampApi.logger.info("nnounce just works");
}, 5000);
```
8. Run the application by pressing F5 or navigate to **Run -> Start Debugging**

## Project structure
Your project directory should look like this:
```
.vscode/
 ├── launch.json
 ├── settings.json
app/
 ├── main.ts
```

## Troubleshooting
VS Code might highlight the `nnounceConnector.ts` import as error before first run. Run the application, it should resolve the issue.

---

This tutorial covered setup of nnounce scripting from Visual Studio Code. Happy coding!