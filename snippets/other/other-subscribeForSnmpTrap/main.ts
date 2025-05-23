nnApi.snmp.subscribeForTrap((event) => {
    console.log("SNMP trap: " + event.trap);
});