import { INnounceClientResultEvent } from "../INnounceClientResultEvent.ts";
import { ANpdConfig, DesignMetadata } from "../dto/DspDesign.ts";

/**
 * Represents the response for design runtime change subscription.
 *
 * This event provides actual design metadata and runtime at subscription time.
 *
 * @interface DesignRuntimeChangedSubscriptionResponseEvent
 * @extends INnounceClientResultEvent
 *
 * @property {DesignMetadata} metadata - Actual metadata information of the design.
 * @property {{[key: string]: ANpdConfig}} runtime - Actual runtime configuration
 * mapping component identifiers to their respective configuration instances.
 */
export interface DesignRuntimeChangedSubscriptionResponseEvent extends INnounceClientResultEvent {
	metadata: DesignMetadata;
	runtime: {[key: string]: ANpdConfig};
}