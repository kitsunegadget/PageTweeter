import { Actions } from "../shared/actions";
import { DEBUG_LOG } from "../shared/debug";

const dev = process.env.NODE_ENV === "development";

function windowClose() {
  if (!dev) window.close();
}

window.onload = function () {
  applyLocaleText();
  applyActinonEvent();
};

function applyLocaleText() {
  document.querySelector<HTMLElement>("#tweet span")!.innerText =
    chrome.i18n.getMessage("tweet_page_text");

  document.querySelector<HTMLElement>("#copy span")!.innerText =
    chrome.i18n.getMessage("clipboard_text");

  document.querySelector<HTMLElement>("#copy-title span")!.innerText =
    chrome.i18n.getMessage("clipboard_title_only_text");

  document.querySelector<HTMLElement>("#rem-param-copy-url span")!.innerText =
    chrome.i18n.getMessage("rem_param_copy_url");
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
  /* @__PURE__ */ DEBUG_LOG?.(tab);

  document.getElementById("tweet")!.onclick = async () => {
    Actions.createTweetWindow(tab);
    windowClose();
  };

  // popup -> background での executeScript が上手くいかないため
  // Actions を sw と popup の両方にバンドルしています
  document.getElementById("copy")!.onclick = async () => {
    Actions.copy(tab);
    windowClose();
  };

  document.getElementById("copy-md-format")!.onclick = async () => {
    Actions.copy(tab, "copy_md_format");
    windowClose();
  };

  document.getElementById("copy-title")!.onclick = async () => {
    Actions.copy(tab, "copy_only_title");
    windowClose();
  };

  document.getElementById("rem-param-copy-url")!.onclick = async () => {
    Actions.copy(tab, "copy_url", true);
    windowClose();
  };
}
