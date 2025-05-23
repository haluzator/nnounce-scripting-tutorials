import { INnounceClientResultEvent } from "../INnounceClientResultEvent.ts";
import { DspDesign } from "../dto/DspDesign.ts";

/**
 * Represents the response event for a design load request.
 *
 * Extends the INnounceClientResultEvent interface to include the loaded design data.
 * Provides access to the resulting design object upon a successful load operation.
 *
 * @property {DspDesign} data Contains the DSP design details.
 */
export interface DesignLoadResultEvent extends INnounceClientResultEvent {
	data: DspDesign;
}