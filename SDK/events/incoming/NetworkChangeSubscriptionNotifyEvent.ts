import { IEvent } from "../IEvent.ts";
import { NetworkStatusDto } from "./NnounceStatusEvent.ts";

export interface NetworkChangeSubscriptionNotifyEvent extends IEvent {
	network: Array<NetworkStatusDto>;
	responseTags: Array<string>;
}