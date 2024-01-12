import { Actions } from "../shared/actions";

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

  /* @__PURE__ */
  console.log(tab);

  const definedTab: DefinedTab = {
    id: tab.id ?? 0,
    url: tab.url ?? "",
    title: tab.title ?? "",
  };

  document.getElementById("tweet")!.onclick = async () => {
    Actions.createTweetWindow(definedTab);
    windowClose();
  };

  // popup -> background での executeScript が上手くいかないため
  // Actions を sw と popup の両方にバンドルしています
  document.getElementById("copy")!.onclick = async () => {
    Actions.copy(definedTab, "COPY");
    windowClose();
  };

  document.getElementById("copy-md-format")!.onclick = async () => {
    Actions.copy(definedTab, "COPY_MD_FORMAT");
    windowClose();
  };

  document.getElementById("copy-title")!.onclick = async () => {
    Actions.copy(definedTab, "COPY_ONLY_TITLE");
    windowClose();
  };

  document.getElementById("rem-param-copy-url")!.onclick = async () => {
    Actions.copy(definedTab, "COPY_NO_PARAM_URL", true);
    windowClose();
  };
}
