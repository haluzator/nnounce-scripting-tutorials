import { DspDesignRuntime } from "../dto/DspDesign.ts";
import { createRequestId, INnounceClientRequestEvent } from "../INnounceClientRequestEvent.ts";

/**
 * Represents an event representing design runtime update within the context of the DSP design runtime.
 * It is an extension of the INnounceClientRequestEvent interface, encapsulating information about the updated design runtime state.
 *
 * The `data` property contains the details of the current runtime design, represented by the `DspDesignRuntime` type.
 *
 * This event is typically used to signal changes or updates to the runtime environment or configuration
 * and propagate these changes throughout the application or to connected systems.
 */
export interface RuntimeUpdateEvent extends INnounceClientRequestEvent {
	data: DspDesignRuntime;
}

/**
 * Creates a RuntimeUpdateEvent object with the provided runtime data.
 *
 * @param {DspDesignRuntime} data - The runtime data to include in the event.
 * @return {RuntimeUpdateEvent} The constructed runtime update event object.
 */
export function createRuntimeUpdateEvent(data: DspDesignRuntime): RuntimeUpdateEvent {
	return {
		data: data,
		requestId: createRequestId(),
		type: "runtimeUpdateEvent"
	}
}