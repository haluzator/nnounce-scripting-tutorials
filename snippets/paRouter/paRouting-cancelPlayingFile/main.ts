const actionId = nnApi.pagingRouter.playLocalFile({
	priority: 2,
	audioFilePath: "test.mp3",
	outputs: ["out1"]}
);
setTimeout(() => {
	if (actionId) {
		console.log(`Cancelling call with action id: ${actionId}`)
		nnApi.pagingRouter.cancelCall(actionId);
	}
}, 5000)