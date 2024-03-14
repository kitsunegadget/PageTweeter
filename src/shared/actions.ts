import { Utils } from "./utils";

export const Actions = {
  async createBskyTab(tab: DefinedTab) {
    const intentURL = new URL("https://bsky.app/intent/compose");
    intentURL.searchParams.set("text", `${tab.title} ${tab.url}`);

    await chrome.tabs.create({
      url: intentURL.toString(),
      index: tab.index + 1,
    });

    /* @__PURE__ */
    console.log("PageTweeter: Create bsky Window!");
  },

  /**
   * Create tweet window.
   * @param {DefinedTab} tab
   */
  async createTweetWindow(tab: DefinedTab) {
    const width = 550;
    const height = 570;
    const { left, top } = await Utils.calcWindowPosition(width, height);

    const slicedTitle = Utils.tweetLimiter(tab.title);

    const intentURL = new URL("https://twitter.com/intent/tweet");
    intentURL.searchParams.set("text", slicedTitle);
    intentURL.searchParams.set("url", tab.url);
    // intentURL.searchParams.set("related", "kitsunegadget:Sharelots created by");

    await chrome.windows.create({
      url: intentURL.toString(),
      width: width,
      height: height,
      top: top,
      left: left,
      type: "popup",
    });

    /* @__PURE__ */
    console.log("PageTweeter: Create Tweet Window!");
  },

  /**
   * Create Facebook share window.
   * @param {DefinedTab} tab
   */
  async createFacebookWindow(tab: DefinedTab) {
    const width = 550;
    const height = 570;
    const { left, top } = await Utils.calcWindowPosition(width, height);

    const shareURL = new URL("https://www.facebook.com/sharer/sharer.php");
    shareURL.searchParams.set("t", tab.title);
    shareURL.searchParams.set("u", tab.url);

    await chrome.windows.create({
      url: shareURL.toString(),
      width: width,
      height: height,
      top: top,
      left: left,
      type: "popup",
    });

    /* @__PURE__ */
    console.log("PageTweeter: Create Facebook Window!");
  },

  /**
   * Create Hatena bookmark window.
   * @param {DefinedTab} tab
   */
  async createHatenaTab(tab: DefinedTab) {
    const shareURL = new URL("http://b.hatena.ne.jp/entry/");
    shareURL.pathname += tab.url;

    await chrome.tabs.create({
      url: shareURL.toString(),
      index: tab.index + 1,
    });

    /* @__PURE__ */
    console.log("PageTweeter: Create Hatena Window!");
  },

  /**
   * Create NOTE window.
   * @param {DefinedTab} tab
   */
  async createNoteTab(tab: DefinedTab) {
    const shareURL = new URL("https://note.mu/intent/post");
    shareURL.searchParams.set("url", tab.url);

    await chrome.tabs.create({
      url: shareURL.toString(),
      index: tab.index + 1,
    });

    /* @__PURE__ */
    console.log("PageTweeter: Create NOTE Window!");
  },

  /**
   * Copy to string.
   * @param {DefinedTab} tab A copy url from tab.
   * @param {ActionType} copyType An action type.
   * @param {boolean} isRemParam Flag to remove parameter.
   */
  async copy(
    tab: DefinedTab,
    copyType: CopyType = "COPY",
    isRemParam: boolean = false
  ) {
    // og が含まれる場合、remParamを通す必要はない
    const newUrl = isRemParam ? Utils.removeParameter(tab.url) : tab.url;

    switch (copyType) {
      case "COPY": {
        await Utils.writeClipBoard(tab.id, `${tab.title} ${newUrl}`);

        /* @__PURE__ */
        console.log("PageTweeter: Copy to ClipBoard!");
        break;
      }
      case "COPY_MD_FORMAT":
        await Utils.writeClipBoard(tab.id, `[${tab.title}](${newUrl})`);

        /* @__PURE__ */
        console.log("PageTweeter: Copy to ClipBoard! MarkDown style.");
        break;

      case "COPY_ONLY_TITLE":
        await Utils.writeClipBoard(tab.id, tab.title);

        /* @__PURE__ */
        console.log("PageTweeter: Copy to ClipBoard! only Title.");
        break;

      case "COPY_NO_PARAM_URL":
        await Utils.writeClipBoard(tab.id, newUrl);

        /* @__PURE__ */
        console.log("PageTweeter: Copy to ClipBoard! only removed param URL.");
        break;

      default:
        throw new Error(copyType satisfies never);
    }
  },
};
