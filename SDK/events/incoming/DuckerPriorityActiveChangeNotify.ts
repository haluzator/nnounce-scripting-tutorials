import { IEvent } from "../IEvent.ts";

export interface DuckerPriorityActiveChangeNotify extends IEvent {
	componentId: number;
	priorityActive: boolean;
	responseTags: Array<string>;
}