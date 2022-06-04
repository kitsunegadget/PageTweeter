import "./shared/actions";

const dev = process.env.NODE_ENV === "development";

///////////////////////
// onInstalled event //
///////////////////////
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
      id: "copy_mdformat",
      parentId: "others",
      title: chrome.i18n.getMessage("clipboard_mdformat_text"),
    },
    () => {
      if (dev) console.log("コンテキストメニュー(copy_mdstyle)を登録したよ！"); // dev log
    }
  );
  chrome.contextMenus.create(
    {
      id: "copy_title",
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

//////////////////////////////////
// contextMenu onClick Listener //
//////////////////////////////////
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab) {
    switch (info.menuItemId) {
      case "tweet_page":
        pageTweeterActions.createTweetWindow(tab);
        if (dev) console.log("id:tweet_page の onClickイベント!"); // dev log

        break;
      case "copy_clip":
        pageTweeterActions.copy(tab);
        if (dev) console.log("id:copy_clip の onClickイベント!"); // dev log

        break;
      case "copy_mdformat":
        pageTweeterActions.copy(tab, "md_format");
        if (dev) console.log("id:copy_title の onClickイベント!"); // dev log

        break;
      case "copy_title":
        pageTweeterActions.copy(tab, "only_title");
        if (dev) console.log("id:copy_title の onClickイベント!"); // dev log

        break;
      default:
        if (dev) console.log("Error! case is not exist."); // dev log
    }
  } else {
    pageTweeterActions.notifyError(0);
  }
});

/////////////////////////////
// clearNotify from pupup. //
/////////////////////////////
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "clearNotify") {
    setTimeout(() => {
      chrome.notifications.clear(message.id);
    }, 6500);

    sendResponse("clearNotify ok");
  }
});
