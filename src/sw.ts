import { Actions } from "./shared/actions";

//===================||
// onInstalled event \/
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "tweet_page",
    title: chrome.i18n.getMessage("tweet_page_text"),
  });

  chrome.contextMenus.create({
    id: "copy_clip",
    title: chrome.i18n.getMessage("clipboard_text"),
  });

  chrome.contextMenus.create({
    id: "copy_md_format",
    title: chrome.i18n.getMessage("clipboard_md_format_text"),
  });

  chrome.contextMenus.create({
    id: "copy_only_title",
    title: chrome.i18n.getMessage("clipboard_title_only_text"),
  });

  chrome.contextMenus.create({
    id: "rem_param_copy_url",
    title: chrome.i18n.getMessage("rem_param_copy_url"),
  });

  // 子要素
  // chrome.contextMenus.create({
  //   id: "rem_param_copy_url",
  //   parentId: "rem_param",
  //   title: chrome.i18n.getMessage("rem_param_copy_url"),
  // });

  // declartiveContent
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.action.disable();

    const rule = {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            schemes: ["http", "https"],
          },
        }),
      ],
      actions: [new chrome.declarativeContent.ShowAction()],
    };

    const rules = [rule];
    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
});

//==========================||
// Process from contextMenu \/
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab) {
    const definedTab: DefinedTab = {
      id: tab.id ?? 0,
      url: tab.url ?? "",
      title: tab.title ?? "",
    };

    switch (info.menuItemId) {
      case "tweet_page":
        Actions.createTweetWindow(definedTab);
        break;

      case "copy_clip":
        Actions.copy(definedTab, "COPY");
        break;

      case "copy_md_format":
        Actions.copy(definedTab, "COPY_MD_FORMAT");
        break;

      case "copy_only_title":
        Actions.copy(definedTab, "COPY_ONLY_TITLE");
        break;

      case "rem_param_copy_url":
        Actions.copy(definedTab, "COPY_NO_PARAM_URL", true);
        break;

      default:
        throw new Error("Error! case is not exist.");
    }
  } else {
    Actions.notifyError(0);
  }
});

//========================||
// clearNotify from popup \/
chrome.runtime.onMessage.addListener(
  (message: ReceiveMessage, _, sendResponse) => {
    if (message.type === "notify_clear") {
      Actions.notifyClear(message.id);
      sendResponse("notify_clear ok");
    }
  }
);
