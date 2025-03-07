chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action == "start") {
      console.log("Start");
    } else if (message.action == "calculate") {
      console.log("Received table data:", request.data);
    }
  });
  