/* eslint-disable no-undef */
"use strict";
import actions from "../js/actions.js";

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
    actions.createTweetWindow(tab);
    window.close();
  };

  document.getElementById("copy").onclick = () => {
    actions.copy(tab);
    window.close();
  };

  document.getElementById("copy-title").onclick = () => {
    actions.copy(tab, true);
    window.close();
  };
};
