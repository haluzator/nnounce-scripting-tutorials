import { INnounceClientRequestEvent } from "../INnounceClientRequestEvent.ts";
import { ISubscriptionEvent } from "../ISubscriptionEvent.ts";


export interface DesignRuntimeChangedSubscriptionRequestEvent extends INnounceClientRequestEvent, ISubscriptionEvent {
	componentNames: Array<string> // set
}