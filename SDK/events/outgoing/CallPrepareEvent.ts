import { IEvent } from "../IEvent.ts";
import { PlayLocalFileParam, PlayRemoteFileParam } from "../../nnPagingRouter.ts";

export interface CallPrepareEvent extends IEvent {
	actionId: string;
	priority: number;
	partial: boolean
	audioSource: AudioSourceDto;
	outputs: Array<string>
}

interface AudioSourceDto {
	sourceType: AudioSourceType,

	// LOCAL_FILE
	path?: string,
	// LIVE
	input?: string,

	// FILE
	url?: string,

	/**
	 * Should be unique for different content, same for same audio files - it's used for caching
	 */
	filename?: string,
	checksum?: string,
	checksumFunction?: string,
	headers?: { [p: string]: string }
	basicAuthUsername?: string,
	basicAuthPassword?: string
}

export function createCallPrepareEventLocalFile(spec: PlayLocalFileParam): CallPrepareEvent {
	return {
		actionId: "nnScriptApi__" + (spec.actionId ?? Date.now().toString()),
		priority: spec.priority,
		partial: spec.partial ?? true,
		audioSource: {
			sourceType: AudioSourceType.LOCAL_FILE,
			path: spec.audioFilePath
		},
		outputs: spec.outputs,
		type: "callPrepareEvent"
	}
}

export function createCallPrepareEventRemoteFile(spec: PlayRemoteFileParam): CallPrepareEvent {
	const actionId = (spec.actionId ?? Date.now().toString());

	const headers: { [p: string]: string } = {};
	spec.audioSource.headers?.forEach((value, key) => {
		headers[key] = value;
	})

	return {
		actionId: "nnScriptApi__" + (actionId ?? Date.now().toString()),
		priority: spec.priority,
		partial: spec.partial ?? true,
		audioSource: {
			sourceType: AudioSourceType.FILE,
			filename: spec.filename,
			url: spec.audioSource.url,
			checksum: spec.audioSource.checksum,
			checksumFunction: spec.audioSource.checksumMethod,
			headers,
			basicAuthUsername: spec.audioSource.basicAuthUsername,
			basicAuthPassword: spec.audioSource.basicAuthPassword,
		},
		outputs: spec.outputs,
		type: "callPrepareEvent"
	}
}

enum AudioSourceType {
	LIVE = "LIVE",
	FILE = "FILE",
	LOCAL_FILE = "LOCAL_FILE"
}


