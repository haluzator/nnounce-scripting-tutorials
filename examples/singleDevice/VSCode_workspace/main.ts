import { nnounceDevice } from "jsr:@nnounce/scripting-api";

const device = await nnounceDevice().connectionPromise();

device.logger.info("single nnounce device scripting");