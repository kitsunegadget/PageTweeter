import "../shared/actions";
import { _debugLog_ } from "../shared/debug-log";

const dev = process.env.NODE_ENV === "development";

window.onload = function () {
  applyLocaleText();
  applyActinonEvent();
};

function applyLocaleText() {
  document.querySelector("#tweet span").innerText =
    chrome.i18n.getMessage("tweet_page_text");

  document.querySelector("#copy span").innerText =
    chrome.i18n.getMessage("clipboard_text");

  document.querySelector("#copy-title span").innerText = chrome.i18n.getMessage(
    "clipboard_title_only_text"
  );
}

async function applyActinonEvent() {
  const tabs = await chrome.tabs
    .query({
      active: true,
      currentWindow: true,
    })
    .catch((err) => {
      throw err;
    });

  const tab = tabs[0];
  _debugLog_?.(tab);

  document.getElementById("tweet").onclick = () => {
    pageTweeterActions.createTweetWindow(tab);
    if (!dev) window.close();
  };

  document.getElementById("copy").onclick = () => {
    pageTweeterActions.copy(tab);
    if (!dev) window.close();
  };

  document.getElementById("copy-mdformat").onclick = () => {
    pageTweeterActions.copy(tab, "md_format");
    if (!dev) window.close();
  };

  document.getElementById("copy-title").onclick = () => {
    pageTweeterActions.copy(tab, "only_title");
    if (!dev) window.close();
  };
}
