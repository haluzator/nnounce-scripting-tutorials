import { INnounceClientResultEvent } from "../INnounceClientResultEvent.ts";


export interface SystemVariableChangeSubscriptionResponseEvent extends INnounceClientResultEvent {
	data: Map<string, string>;
}