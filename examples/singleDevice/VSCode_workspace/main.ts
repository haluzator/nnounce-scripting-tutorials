import { nnounceDevice } from "nnounceDevice";

const device = await nnounceDevice().connectionPromise();

device.logger.info("single nnounce device scripting");