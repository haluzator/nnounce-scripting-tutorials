const value = nnApi.system.variables.get("nameOfVariable");
console.log(`Variable value: ${value}`);
console.log(`Variable boolean value: ${nnApi.util.toBoolean(value)}`);