import { Actions } from "./shared/actions";

//===================||
// onInstalled event \/
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create(
    {
      id: "tweet_page",
      title: chrome.i18n.getMessage("tweet_page_text"),
    },
    () => {
      /* @__PURE__ */ console.log("コンテキストメニュー(tweet_page)を作成");
    }
  );
  chrome.contextMenus.create(
    {
      id: "copy_clip",
      title: chrome.i18n.getMessage("clipboard_text"),
    },
    () => {
      /* @__PURE__ */ console.log("コンテキストメニュー(copy_clip)を作成");
    }
  );
  // chrome.contextMenus.create(
  //   {
  //     id: "others",
  //     title: chrome.i18n.getMessage("context_others"),
  //   },
  //   () => {
  //     DEBUG_LOG?.log("コンテキストメニュー(others)を登録したよ！"); // dev log
  //   }
  // );

  // 子要素
  chrome.contextMenus.create(
    {
      id: "copy_md_format",
      // parentId: "others",
      title: chrome.i18n.getMessage("clipboard_md_format_text"),
    },
    () => {
      /* @__PURE__ */ console.log("コンテキストメニュー(copy_md_format)を作成");
    }
  );
  chrome.contextMenus.create(
    {
      id: "copy_only_title",
      // parentId: "others",
      title: chrome.i18n.getMessage("clipboard_title_only_text"),
    },
    () => {
      /* @__PURE__ */ console.log(
        "コンテキストメニュー(copy_only_title)を作成"
      );
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
        break;

      case "copy_clip":
        Actions.copy(tab);
        break;

      case "copy_md_format":
        Actions.copy(tab, "copy_md_format");
        break;

      case "copy_only_title":
        Actions.copy(tab, "copy_only_title");
        break;

      default:
        throw new Error("Error! case is not exist.");
    }
  } else {
    Actions.notifyError(0);
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
