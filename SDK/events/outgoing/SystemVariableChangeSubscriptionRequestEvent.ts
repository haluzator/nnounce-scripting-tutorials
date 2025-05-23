import { INnounceClientRequestEvent } from "../INnounceClientRequestEvent.ts";


export interface SystemVariableChangeSubscriptionRequestEvent extends INnounceClientRequestEvent {
	responseTag: string
}