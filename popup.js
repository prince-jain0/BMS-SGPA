document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('startButton');
  const calculateButton = document.getElementById('calculateButton');
 
  startButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "start"});
    });
  });
  calculateButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "calculate" });
    });
  });
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action == "display_data") {
      const data = message.data;
      const dataContainer = document.getElementById('sgpaLabel');
      dataContainer.innerHTML = data;
    }
  });
});