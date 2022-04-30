/* eslint-disable no-undef */
"use strict";
import { actions } from "./js/actions.js";

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
  //子要素
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

//
// contextMenu onClick Listener
//
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab) {
    console.log(tab);
    switch (info.menuItemId) {
      case "tweet_page":
        actions.createTweetWindow(tab);
        console.log("id:tweet_page の onClickイベント!");

        break;
      case "copy_clip":
        actions.copy(tab);
        console.log("id:copy_clip の onClickイベント!");

        break;
      case "copy_title":
        actions.copy(tab, true);
        console.log("id:copy_title の onClickイベント!");

        break;
      default:
        console.log("Error! case is not exist.");
    }
  } else {
    popupAlert();
  }
});
