/**
 * Interface to control component gain value and output mute state.
 */
export interface NnDspComponentControl {
	/**
	 * Set gain of component.
	 * @param value - gain value in dB.
	 */
	setGain: { (value: number): Promise<void> };
	/**
	 * Get gain of component.
	 * @return gain value in dB.
	 */
	getGain: { () : number | undefined };
	/**
	 * Un/mute component output.
	 * @param mute - true to mute component output, false to unmute
	 */
	setMute: { (mute: boolean): Promise<void> };
	/**
	 * Get mute state of component output.
	 * @return true if component output is muted, false otherwise.
	 */
	isMute: {  () : boolean | undefined };
}
