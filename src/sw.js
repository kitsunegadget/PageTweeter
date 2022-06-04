import { Actions } from "./shared/actions";
import { _debugLog_ } from "./shared/debug";

const dev = process.env.NODE_ENV === "development";

//===================||
// onInstalled event \/
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create(
    {
      id: "tweet_page",
      title: chrome.i18n.getMessage("tweet_page_text"),
    },
    () => {
      if (dev) console.log("コンテキストメニュー(tweet_page)を登録したよ！"); // dev log
    }
  );
  chrome.contextMenus.create(
    {
      id: "copy_clip",
      title: chrome.i18n.getMessage("clipboard_text"),
    },
    () => {
      if (dev) console.log("コンテキストメニュー(copy_clip)を登録したよ！"); // dev log
    }
  );
  chrome.contextMenus.create(
    {
      id: "others",
      title: chrome.i18n.getMessage("context_others"),
    },
    () => {
      if (dev) console.log("コンテキストメニュー(others)を登録したよ！"); // dev log
    }
  );

  // 子要素
  chrome.contextMenus.create(
    {
      id: "copy_md_format",
      parentId: "others",
      title: chrome.i18n.getMessage("clipboard_md_format_text"),
    },
    () => {
      if (dev) console.log("コンテキストメニュー(copy_mdstyle)を登録したよ！"); // dev log
    }
  );
  chrome.contextMenus.create(
    {
      id: "copy_only_title",
      parentId: "others",
      title: chrome.i18n.getMessage("clipboard_title_only_text"),
    },
    () => {
      if (dev) console.log("コンテキストメニュー(copy_title)を登録したよ！"); // dev log
    }
  );

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
    switch (info.menuItemId) {
      case "tweet_page":
        Actions.createTweetWindow(tab);
        _debugLog_?.("id:tweet_page の onClickイベント!");
        break;

      case "copy_clip":
        Actions.copy(tab);
        _debugLog_?.("id:copy_clip の onClickイベント!");
        break;

      case "copy_md_format":
        Actions.copy(tab, "copy_md_format");
        _debugLog_?.("id:copy_title の onClickイベント!");
        break;

      case "copy_only_title":
        Actions.copy(tab, "copy_only_title");
        _debugLog_?.("id:copy_title の onClickイベント!");
        break;

      default:
        throw new Error("Error! case is not exist.");
    }
  } else {
    pageTweeterActions.notifyError(0);
  }
});

//========================||
// clearNotify from pupup \/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "clearNotify") {
    setTimeout(() => {
      chrome.notifications.clear(message.id);
    }, 6500);

    sendResponse("clearNotify ok");
  }
});
