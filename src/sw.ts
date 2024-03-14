import { notifyError } from "./shared/notifications";
import { runActions } from "./shared/runActions";

//===================||
// onInstalled event \/
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "SNS",
    title: chrome.i18n.getMessage<I18nMessageType>("contextmenu_sns"),
  });

  chrome.contextMenus.create<ActionType>({
    id: "COPY",
    title: chrome.i18n.getMessage<I18nMessageType>("copy"),
  });
  chrome.contextMenus.create<ActionType>({
    id: "COPY_MD_FORMAT",
    title: chrome.i18n.getMessage<I18nMessageType>("copy_md_format"),
  });
  chrome.contextMenus.create<ActionType>({
    id: "COPY_ONLY_TITLE",
    title: chrome.i18n.getMessage<I18nMessageType>("copy_only_title"),
  });
  chrome.contextMenus.create<ActionType>({
    id: "COPY_NO_PARAM_URL",
    title: chrome.i18n.getMessage<I18nMessageType>("copy_no_param_url"),
  });

  // 子要素
  chrome.contextMenus.create<ActionType>({
    id: "TWEET",
    parentId: "SNS",
    title: chrome.i18n.getMessage<I18nMessageType>("share_twitter"),
  });
  chrome.contextMenus.create<ActionType>({
    id: "BSKY",
    parentId: "SNS",
    title: chrome.i18n.getMessage<I18nMessageType>("share_bsky"),
  });
  chrome.contextMenus.create<ActionType>({
    id: "FACEBOOK",
    parentId: "SNS",
    title: chrome.i18n.getMessage<I18nMessageType>("share_facebook"),
  });
  chrome.contextMenus.create<ActionType>({
    id: "HATENA",
    parentId: "SNS",
    title: chrome.i18n.getMessage<I18nMessageType>("share_hatena"),
  });
  chrome.contextMenus.create<ActionType>({
    id: "NOTE",
    parentId: "SNS",
    title: chrome.i18n.getMessage<I18nMessageType>("share_note"),
  });

  // declarativeContent
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    void chrome.action.disable().then(() => {
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
});

//==========================||
// Process from contextMenu \/
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab?.id == null) {
    void notifyError("UNAVAILABLE_TAB");
    return;
  }

  const definedTab: DefinedTab = {
    ...tab,
    id: tab.id,
    title: tab.title ?? "",
    url: tab.url ?? "",
  };

  void runActions(definedTab, info.menuItemId as ActionType);
});
