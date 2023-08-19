import { testStorage } from "../storage";

function main() {
  console.log("Hello, from background web worker!");

  onmessage = (messageEvent) => {
    const messageData = messageEvent.data;

    switch (messageData) {
      case "testStorage":
        testStorage();
        break;
      default:
        console.error(`Unknown message: ${messageData}`);
        break;
    }
  };
}

main();
