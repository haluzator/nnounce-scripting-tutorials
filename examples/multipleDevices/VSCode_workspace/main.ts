// import the connect function
import { connectDevice } from "jsr:@nnounce/scripting-api";

// connect devices
const ampnode =  connectDevice("ampnode4-900094", null);
const micnode = connectDevice("micnode2h-90012e", null);

// some logging
console.log("Multiple device management script demo");
micnode.logger.info("This log will be visible only in micnode's log");

// when ampnode input pin 1 is set high, trigger playing a file on micnode
ampnode.controlInputs.digital(1).onChange((val) => {
    console.log("ampnode input pin 1 set to ", val);
    if (val && micnode.isConnected()) {
        micnode.pagingRouter.playLocalFile({
            priority: 3,
            audioFilePath: "audio.flac",
            outputs: ["out1"]
        });
    }
});