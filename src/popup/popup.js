"use strict";

import "../shared/actions";

window.onload = async function () {
  const tabs = await chrome.tabs
    .query({
      active: true,
      currentWindow: true,
    })
    .catch((err) => {
      const bgWindow = chrome.extension.getBackgroundPage();
      bgWindow.popupAlert();
      throw err;
    });
    
  const tab = tabs[0];
  console.log(tab);

  document.getElementById("tweet").onclick = () => {
    pageTweeterActions.createTweetWindow(tab);
    window.close();
  };

  document.getElementById("copy").onclick = () => {
    pageTweeterActions.copy(tab);
    window.close();
  };

  document.getElementById("copy-title").onclick = () => {
    pageTweeterActions.copy(tab, true);
    window.close();
  };
};
