const actionId = nnApi.pagingRouter.playRemoteFile({
	priority: 2,
	outputs: ["out1"],
	filename: "filename.mp3",
	partial: false,
	actionId: "uniqueActionId", //optional
	audioSource: {
		url: "https://localhost/path/to/file",
		basicAuthPassword: "password", //optional
		basicAuthUsername: "username", //optional
		checksum: "hash123", //optional
		checksumMethod: "blake3", //optional
		headers: new Map([["Name", "value"]]) //optional
	}
});