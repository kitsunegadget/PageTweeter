import "./popup.css";
import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import { Actions } from "../shared/actions";

type ActionInfo = {
  actionType: ActionType;
  text: string;
  iconSrc: string;
};

interface ActionItemProps {
  item: Readonly<ActionInfo>;
  handleClick: Function;
}

interface ActionListProps {
  actionInfos: Readonly<ActionInfo>[];
}

const ActionInfos: Readonly<ActionInfo>[] = [
  {
    actionType: "TWEET",
    text: chrome.i18n.getMessage<I18nMessageType>("text_tweet_page"),
    iconSrc: "./images/Twitter social icons - circle - blue.svg",
  },
  {
    actionType: "BSKY",
    text: chrome.i18n.getMessage<I18nMessageType>("text_share_bsky"),
    iconSrc: "./images/bluesky-1.svg",
  },
  {
    actionType: "COPY",
    text: chrome.i18n.getMessage<I18nMessageType>("text_copy"),
    iconSrc: "./images/content_copy_FILL0_wght400_GRAD0_opsz48.svg",
  },
  {
    actionType: "COPY_MD_FORMAT",
    text: chrome.i18n.getMessage<I18nMessageType>("text_copy_md_format"),
    iconSrc: "./images/content_copy_FILL0_wght400_GRAD0_opsz48.svg",
  },
  {
    actionType: "COPY_ONLY_TITLE",
    text: chrome.i18n.getMessage<I18nMessageType>("text_copy_only_title"),
    iconSrc: "./images/title_FILL0_wght400_GRAD0_opsz48.svg",
  },
  {
    actionType: "COPY_NO_PARAM_URL",
    text: chrome.i18n.getMessage<I18nMessageType>("text_copy_no_param_url"),
    iconSrc: "./images/content_copy_FILL0_wght400_GRAD0_opsz48.svg",
  },
];

function ActionItem({ item, handleClick }: ActionItemProps) {
  return (
    <a href="#" onClick={() => handleClick(item.actionType)}>
      <img src={item.iconSrc} width="24" height="24" />
      <span>{item.text}</span>
    </a>
  );
}

function ActionList({ actionInfos }: ActionListProps) {
  const isTabLoadingRef = useRef(false);

  async function handleClick(actionType: ActionType) {
    if (isTabLoadingRef.current) {
      return;
    }

    isTabLoadingRef.current = true;
    const tab = await getCurrentDefinedTab();

    switch (actionType) {
      case "TWEET": {
        await Actions.createTweetWindow(tab);
        break;
      }
      case "BSKY": {
        await Actions.createBskyWindow(tab);
        break;
      }
      case "COPY_NO_PARAM_URL": {
        await Actions.copy(tab, actionType, true);
        break;
      }
      case "COPY":
      case "COPY_MD_FORMAT":
      case "COPY_ONLY_TITLE": {
        await Actions.copy(tab, actionType);
        break;
      }
      default: {
      }
    }
    isTabLoadingRef.current = false;

    windowClose();
  }

  const actionItems = actionInfos.map((item) => {
    return (
      <li key={item.actionType}>
        <ActionItem item={item} handleClick={handleClick} />
      </li>
    );
  });

  return <menu className="action-list">{actionItems}</menu>;
}

const domNode = document.getElementById("action-section")!;
const root = createRoot(domNode);
root.render(
  <React.StrictMode>
    <ActionList actionInfos={ActionInfos} />
  </React.StrictMode>
);

/**
 * Get a current tab as DefinedTab.
 * @returns A DefinedTab
 */
async function getCurrentDefinedTab() {
  const [tab] = await chrome.tabs
    .query({
      active: true,
      currentWindow: true,
    })
    .catch((err) => {
      throw err;
    });

  /* @__PURE__ */
  console.log(tab);

  const definedTab: DefinedTab = {
    ...tab,
    id: tab.id ?? 0,
    url: tab.url ?? "",
    title: tab.title ?? "",
  };

  return definedTab;
}

const dev = process.env.NODE_ENV === "development";

function windowClose() {
  if (!dev) window.close();
}
