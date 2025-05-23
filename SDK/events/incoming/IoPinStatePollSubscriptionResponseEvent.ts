import { INnounceClientResultEvent } from "../INnounceClientResultEvent.ts";
import { IoControl } from "./IoPinStateSubscriptionNotify.ts";


export interface IoPinStatePollSubscriptionResponseEvent extends INnounceClientResultEvent {
	states: Array<IoControl>;
}