import { INnounceClientRequestEvent } from "../INnounceClientRequestEvent.ts";
import { IPollSubscriptionEvent } from "../IPollSubscriptionEvent.ts";


export interface IoPinStatePollSubscriptionRequestEvent extends INnounceClientRequestEvent, IPollSubscriptionEvent {
}