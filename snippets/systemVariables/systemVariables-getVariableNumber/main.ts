const value = nnApi.system.variables.get("nameOfVariable");
console.log(`Variable value: ${value}`);
console.log(`Variable number value: ${nnApi.util.toNumber(value)}`);