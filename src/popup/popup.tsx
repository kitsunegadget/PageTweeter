import "./popup.css";
import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import { Actions } from "../shared/actions";

type ActionInfo = {
  actionType: ActionType;
  text: string;
  iconSrc: string;
  iconSize?: number;
};

interface ActionItemProps {
  item: Readonly<ActionInfo>;
  handleClick: (actionType: ActionType) => Promise<void>;
}

interface ActionListProps {
  actionInfos: Readonly<ActionInfo>[];
}

const ActionInfos: Readonly<ActionInfo>[] = [
  {
    actionType: "TWEET",
    text: chrome.i18n.getMessage<I18nMessageType>("share_twitter"),
    iconSrc: "./images/Twitter social icons - circle - blue.svg",
  },
  {
    actionType: "BSKY",
    text: chrome.i18n.getMessage<I18nMessageType>("share_bsky"),
    iconSrc: "./images/bluesky-1.svg",
  },
  {
    actionType: "FACEBOOK",
    text: chrome.i18n.getMessage<I18nMessageType>("share_facebook"),
    iconSrc: "./images/Facebook_Logo_Primary.png",
    iconSize: 16,
  },
  {
    actionType: "HATENA",
    text: chrome.i18n.getMessage<I18nMessageType>("share_hatena"),
    iconSrc: "./images/hatenabookmark_symbolmark.png",
    iconSize: 20,
  },
  {
    actionType: "NOTE",
    text: chrome.i18n.getMessage<I18nMessageType>("share_note"),
    iconSrc: "./images/note_icon.svg",
  },
  {
    actionType: "COPY",
    text: chrome.i18n.getMessage<I18nMessageType>("copy"),
    iconSrc: "./images/content_copy_FILL0_wght400_GRAD0_opsz48.svg",
  },
  {
    actionType: "COPY_MD_FORMAT",
    text: chrome.i18n.getMessage<I18nMessageType>("copy_md_format"),
    iconSrc: "./images/content_copy_FILL0_wght400_GRAD0_opsz48.svg",
  },
  {
    actionType: "COPY_ONLY_TITLE",
    text: chrome.i18n.getMessage<I18nMessageType>("copy_only_title"),
    iconSrc: "./images/title_FILL0_wght400_GRAD0_opsz48.svg",
  },
  {
    actionType: "COPY_NO_PARAM_URL",
    text: chrome.i18n.getMessage<I18nMessageType>("copy_no_param_url"),
    iconSrc: "./images/content_copy_FILL0_wght400_GRAD0_opsz48.svg",
  },
];

function ActionItem({ item, handleClick }: ActionItemProps) {
  const iconSize = item.iconSize ?? 24;
  return (
    <a href="#" onClick={() => void handleClick(item.actionType)}>
      <div>
        <img src={item.iconSrc} width={iconSize} height={iconSize} />
      </div>
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

    if (!Actions.checkUrlScheme(tab.url)) {
      void Actions.notifyError("UNAVAILABLE_SCHEME");
      isTabLoadingRef.current = false;
      windowClose();
      return;
    }

    switch (actionType) {
      case "TWEET": {
        await Actions.createTweetWindow(tab);
        break;
      }
      case "BSKY": {
        await Actions.createBskyTab(tab);
        break;
      }
      case "FACEBOOK": {
        await Actions.createFacebookWindow(tab);
        break;
      }
      case "HATENA": {
        await Actions.createHatenaTab(tab);
        break;
      }
      case "NOTE": {
        await Actions.createNoteTab(tab);
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
        throw new Error(actionType satisfies never);
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
    .catch((err: unknown) => {
      void Actions.notifyError("UNAVAILABLE_TAB");
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error(String(err));
      }
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
