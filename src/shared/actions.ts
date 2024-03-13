type OgpProp = "title" | "url";

export const Actions = {
  async getScreenHeight() {
    if (Object.prototype.hasOwnProperty.call(globalThis, "screen")) {
      return screen.height;
    } else {
      const displayInfo = await chrome.system.display.getInfo();
      if (displayInfo) {
        return displayInfo[0].bounds.height;
      }
    }
    return 1920;
  },

  async getScreenWidth() {
    if (Object.prototype.hasOwnProperty.call(globalThis, "screen")) {
      return screen.width;
    } else {
      const displayInfo = await chrome.system.display.getInfo();
      if (displayInfo) return displayInfo[0].bounds.width;
    }
    return 1080;
  },

  /**
   * ウィンドウ表示位置設定
   * @param width the window width.
   * @param height the window height.
   */
  async calcWindowPosition(
    width: number,
    height: number
  ): Promise<{ top: number; left: number }> {
    const screenWidth = await this.getScreenWidth();
    const screenHeight = await this.getScreenHeight();

    let left = 0;
    if (screenWidth > width) {
      left = Math.round(screenWidth / 2 - width / 2);
    }

    let top = 0;
    if (screenHeight > height) {
      top = Math.round(screenHeight / 2 - height / 2);
    }

    /* @__PURE__ */
    console.log(screenWidth, screenHeight);

    return { top, left };
  },

  /**
   * スキームのチェック
   * @param {string} url A URL string.
   * @returns {boolean} Only "http" or "https" scheme is true.
   */
  checkUrlScheme(url: string): boolean {
    return /^http(s|):\/\/.+?\/.*/g.test(url);
  },

  /**
   * Get OGP content if the site has OGP meta tag.
   * @param ogpProp OGP property name to retrieve.
   * @param tabId Scripting tab id.
   * @returns An OGP content or null.
   */
  async getOgpContent(ogpProp: OgpProp, tabId: number): Promise<string | null> {
    const injectionResult = await chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        args: [{ ogpProp }],
        func: (args) => {
          const ogpContent = document.head
            .querySelector(`meta[property="og:${args.ogpProp}"]`)
            ?.getAttribute("content");
          return ogpContent;
        },
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          console.info(err.message);
        } else {
          console.info(err);
        }
      });

    if (injectionResult) {
      return injectionResult[0].result ?? null; // not found to null
    }

    return null;
  },

  /**
   * URLパラメーターを削除
   * @param {string} url
   * @returns {string} A URL with parameters removed.
   */
  removeParameter(url: string): string {
    return url.replace(/\?.+/, "");
  },

  /**
   * Limiting text length to 140.
   * @param text An original text.
   * @returns A processed text.
   */
  tweetLimiter(text: string): string {
    const tcoLength = 13 + 10; // t.co の短縮URLの長さ https:// t.co / [10文字]
    // 文字後にある半角スペース１個までは、文字数にカウントされない
    const wordMatches = text.match(/\s*\S+\s{0,1}/g) ?? [];
    const spaceLength = wordMatches.length - 1;
    const allLength = text.length + tcoLength - spaceLength;

    if (allLength > 140) {
      let isSliced = false;
      const limitLength = 140 - (tcoLength + 3);

      const slicedText = wordMatches.reduce((acc, current, index) => {
        if (isSliced) {
          return acc;
        }

        const length = acc.length + current.length - (index + 1);

        if (length > limitLength) {
          const removeLength = length - limitLength;
          const slicedCurrent = current.slice(0, -removeLength) + "...";
          isSliced = true;

          return acc + slicedCurrent;
        } else {
          return acc + current;
        }
      });

      return slicedText;
    } else {
      return text;
    }
  },

  async createBskyTab(tab: DefinedTab) {
    const newTitle = (await this.getOgpContent("title", tab.id)) ?? tab.title;
    const newUrl = (await this.getOgpContent("url", tab.id)) ?? tab.url;

    const intentURL = new URL("https://bsky.app/intent/compose");
    intentURL.searchParams.set("text", `${newTitle} ${newUrl}`);

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
    const { left, top } = await this.calcWindowPosition(width, height);

    const ogTitle = await this.getOgpContent("title", tab.id);
    const slicedTitle = ogTitle
      ? this.tweetLimiter(ogTitle)
      : this.tweetLimiter(tab.title);
    const newUrl = (await this.getOgpContent("url", tab.id)) ?? tab.url;

    const intentURL = new URL("https://twitter.com/intent/tweet");
    intentURL.searchParams.set("text", slicedTitle);
    intentURL.searchParams.set("url", newUrl);
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
    const { left, top } = await this.calcWindowPosition(width, height);

    const newTitle = (await this.getOgpContent("title", tab.id)) ?? tab.title;
    const newUrl = (await this.getOgpContent("url", tab.id)) ?? tab.url;

    // URL 作成
    const shareURL = new URL("https://www.facebook.com/sharer/sharer.php");
    shareURL.searchParams.set("t", newTitle);
    shareURL.searchParams.set("u", newUrl);

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
    const newUrl = (await this.getOgpContent("url", tab.id)) ?? tab.url;
    const shareURL = new URL("http://b.hatena.ne.jp/entry/");
    shareURL.pathname += newUrl;

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
    const newUrl = (await this.getOgpContent("url", tab.id)) ?? tab.url;
    const shareURL = new URL("https://note.mu/intent/post");
    shareURL.searchParams.set("url", newUrl);

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
   * @param {boolean} remParam Flag to remove parameter.
   */
  async copy(
    tab: DefinedTab,
    copyType: CopyType = "COPY",
    remParam: boolean = false
  ) {
    const newTitle = (await this.getOgpContent("title", tab.id)) ?? tab.title;
    const ogUrl = await this.getOgpContent("url", tab.id);
    const newUrl = ogUrl ? ogUrl : tab.url;

    // og が含まれる場合、remParamを通す必要はない
    const url =
      ogUrl == null && remParam ? this.removeParameter(newUrl) : newUrl;

    switch (copyType) {
      case "COPY": {
        await this.writeClipBoard(tab.id, `${newTitle} ${url}`);

        /* @__PURE__ */
        console.log("PageTweeter: Copy to ClipBoard!");
        break;
      }
      case "COPY_MD_FORMAT":
        await this.writeClipBoard(tab.id, `[${newTitle}](${url})`);

        /* @__PURE__ */
        console.log("PageTweeter: Copy to ClipBoard! MarkDown style.");
        break;

      case "COPY_ONLY_TITLE":
        await this.writeClipBoard(tab.id, newTitle);

        /* @__PURE__ */
        console.log("PageTweeter: Copy to ClipBoard! only Title.");
        break;

      case "COPY_NO_PARAM_URL":
        await this.writeClipBoard(tab.id, url);

        /* @__PURE__ */
        console.log("PageTweeter: Copy to ClipBoard! only removed param URL.");
        break;

      default:
        throw new Error(copyType satisfies never);
    }
  },

  /**
   * Apply writing to the ClipBoard.
   * @param {number} tabId A chrome Tab id.
   * @param {string} text A text to write.
   */
  async writeClipBoard(tabId: number, text: string) {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          args: [{ text: text }],
          func: async (args) => {
            await navigator.clipboard.writeText(args.text);
          },
        });
      }
    } catch (err: unknown) {
      await this.notifyError("COPY_FAILED");
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(err);
      }
    }
  },

  /**
   * Notify unavailable message.
   * @param {number} errorType
   */
  async notifyError(errorType: ErrorType) {
    const id = "SharelotsNotification";

    /* @__PURE__ */
    console.log(id, errorType);

    chrome.notifications.clear(id);

    const notifyOptions: chrome.notifications.NotificationOptions<true> = {
      title: "Sharelots",
      message: "",
      iconUrl: chrome.runtime.getURL("icon.png"),
      type: "basic",
      requireInteraction: true,
    };

    switch (errorType) {
      case "UNAVAILABLE_SCHEME": {
        notifyOptions.message =
          chrome.i18n.getMessage<I18nMessageType>("error_unavailable");
        notifyOptions.contextMessage = "[Error] Unavailable scheme";
        break;
      }
      case "UNAVAILABLE_TAB": {
        notifyOptions.message =
          chrome.i18n.getMessage<I18nMessageType>("error_unavailable");
        notifyOptions.contextMessage = "[Error] Unavailable tabs";
        break;
      }
      case "COPY_FAILED": {
        notifyOptions.message =
          chrome.i18n.getMessage<I18nMessageType>("error_copy_failed");
        notifyOptions.contextMessage = "[Error] Could not write to Clipboard";
        break;
      }
      default: {
        throw new Error(errorType satisfies never);
      }
    }
    // eslint-disable-next-line
    await chrome.notifications.create(id, notifyOptions);
  },
};
