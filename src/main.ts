import backgroundWebWorker from "./worker/background?worker&url";
import serviceWorker from "./worker/service?worker&url";

const serviceWorkerEnabled: boolean = false;

if (serviceWorkerEnabled && "serviceWorker" in navigator) {
  navigator.serviceWorker.register(serviceWorker, { type: "module" });
}

console.log(backgroundWebWorker, import.meta.url);
const w = new Worker(new URL(backgroundWebWorker, import.meta.url), {
  type: "module",
});

console.log("Hello, Vite!");

w.postMessage("testStorage");
