"use strict";

import "./shared/actions";

//
// onInstalled event
//
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create(
    {
      id: "tweet_page",
      title: "このページをツイート",
    },
    () => {
      console.log("コンテキストメニュー(tweet_page)を登録したよ！");
    }
  );
  chrome.contextMenus.create(
    {
      id: "copy_clip",
      title: "クリップボードにコピー",
    },
    () => {
      console.log("コンテキストメニュー(copy_clip)を登録したよ！");
    }
  );
  chrome.contextMenus.create(
    {
      id: "others",
      title: "その他",
    },
    () => {
      console.log("コンテキストメニュー(others)を登録したよ！");
    }
  );
  // 子要素
  chrome.contextMenus.create(
    {
      id: "copy_title",
      parentId: "others",
      title: "ページタイトルのみをコピー",
    },
    () => {
      console.log("コンテキストメニュー(copy_title)を登録したよ！");
    }
  );

  // declartiveContent
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
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
        if (dev) console.log("id:tweet_page の onClickイベント!");

        break;
      case "copy_clip":
        pageTweeterActions.copy(tab);
        if (dev) console.log("id:copy_clip の onClickイベント!");

        break;
      case "copy_title":
        pageTweeterActions.copy(tab, true);
        if (dev) console.log("id:copy_title の onClickイベント!");

        break;
      default:
        if (dev) console.log("Error! case is not exist.");
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
