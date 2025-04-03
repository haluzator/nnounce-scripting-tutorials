import { initializeNnounceApi } from "initialization";
(async () => {
    await initializeNnounceApi();
    await import("./script.ts");
})();
