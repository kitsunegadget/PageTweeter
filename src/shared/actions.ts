type OgpProp = "title" | "url";

export const Actions = {
  /**
   * tweetウィンドウ用のオプション
   */
  get windowOptions() {
    return "scrollbars=yes,resizable=yes,toolbar=no,location=yes";
  },

  /**
   * スクリーン高さ
   */
  get screenHeight() {
    const wrap = async () => {
      if (globalThis.hasOwnProperty("screen")) {
        return screen.height;
      } else {
        const displayInfo = await chrome.system.display.getInfo();
        if (displayInfo) return displayInfo[0].bounds.height;

        return 1920;
      }
    };

    return wrap();
  },

  /**
   * スクリーン幅
   */
  get screenWidth() {
    const wrap = async () => {
      if (globalThis.hasOwnProperty("screen")) {
        return screen.width;
      } else {
        const displayInfo = await chrome.system.display.getInfo();
        if (displayInfo) return displayInfo[0].bounds.width;

        return 1080;
      }
    };

    return wrap();
  },

  /**
   * ウィンドウ表示位置設定
   * @param width the window width.
   * @param height the window height.
   */
  async setWindowPosition(
    width: number,
    height: number
  ): Promise<{ top: number; left: number }> {
    const left = Math.round((await this.screenWidth) / 2 - width / 2);
    let top = 0;

    if ((await this.screenHeight) > height) {
      top = Math.round((await this.screenHeight) / 2 - height / 2);
    }

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
      .catch((err) => {
        console.info(err);
      });

    if (injectionResult) {
      return injectionResult[0].result; // not found to null
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

  async createBskyWindow(tab: DefinedTab) {
    if (!this.checkUrlScheme(tab.url)) {
      await this.notifyError(0);
      return;
    }

    const ogTitle = await this.getOgpContent("title", tab.id);
    const ogUrl = await this.getOgpContent("url", tab.id);
    const newTitle = ogTitle ? ogTitle : tab.title;
    const newUrl = ogUrl ? ogUrl : tab.url;

    const intentURL = new URL("https://bsky.app/intent/compose");
    intentURL.searchParams.set("text", `${newTitle} ${newUrl}`);

    chrome.tabs.create({
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
    if (!this.checkUrlScheme(tab.url)) {
      await this.notifyError(0);
      return;
    }

    const width = 550;
    const height = 570;
    const { left, top } = await this.setWindowPosition(width, height);

    /* @__PURE__ */
    console.log(await this.screenWidth, await this.screenHeight);

    const ogTitle = await this.getOgpContent("title", tab.id);
    const ogUrl = await this.getOgpContent("url", tab.id);
    const slicedTitle = ogTitle
      ? this.tweetLimiter(ogTitle)
      : this.tweetLimiter(tab.title);
    const newUrl = ogUrl ? ogUrl : tab.url;

    // URL 作成
    const intentURL = new URL("https://twitter.com/intent/tweet");
    intentURL.searchParams.set("text", slicedTitle);
    intentURL.searchParams.set("url", newUrl);
    intentURL.searchParams.set(
      "related",
      "kitsunegadget:PageTweeter created by"
    );

    chrome.windows.create({
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
    if (!this.checkUrlScheme(tab.url)) {
      await this.notifyError(0);
      return;
    }

    const width = 550;
    const height = 570;
    const { left, top } = await this.setWindowPosition(width, height);

    /* @__PURE__ */
    console.log(await this.screenWidth, await this.screenHeight);

    const ogTitle = await this.getOgpContent("title", tab.id);
    const ogUrl = await this.getOgpContent("url", tab.id);
    const newTitle = ogTitle ? ogTitle : tab.title;
    const newUrl = ogUrl ? ogUrl : tab.url;

    // URL 作成
    const shareURL = new URL("https://www.facebook.com/sharer/sharer.php");
    shareURL.searchParams.set("t", newTitle);
    shareURL.searchParams.set("u", newUrl);

    chrome.windows.create({
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
  async createHatenaWindow(tab: DefinedTab) {
    if (!this.checkUrlScheme(tab.url)) {
      await this.notifyError(0);
      return;
    }

    const ogUrl = await this.getOgpContent("url", tab.id);
    const newUrl = ogUrl ? ogUrl : tab.url;

    // URL 作成
    const shareURL = new URL("http://b.hatena.ne.jp/entry/");
    shareURL.pathname += newUrl;

    chrome.tabs.create({
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
  async createNoteWindow(tab: DefinedTab) {
    if (!this.checkUrlScheme(tab.url)) {
      await this.notifyError(0);
      return;
    }

    const ogUrl = await this.getOgpContent("url", tab.id);
    const newUrl = ogUrl ? ogUrl : tab.url;

    // URL 作成
    const shareURL = new URL("https://note.mu/intent/post");
    shareURL.searchParams.set("url", newUrl);

    chrome.tabs.create({
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
    if (!this.checkUrlScheme(tab.url)) {
      this.notifyError(0);
      return;
    }

    const ogTitle = await this.getOgpContent("title", tab.id);
    const ogUrl = await this.getOgpContent("url", tab.id);
    const newTitle = ogTitle ? ogTitle : tab.title;
    const newUrl = ogUrl ? ogUrl : tab.url;

    // og が含まれる場合、remParamを通す必要はない
    const url =
      ogUrl == null && remParam ? this.removeParameter(newUrl) : newUrl;

    switch (copyType) {
      case "COPY": {
        this.writeClipBoard(tab.id!, `${newTitle} ${url}`);

        /* @__PURE__ */
        console.log("PageTweeter: Copy to ClipBoard!");
        break;
      }
      case "COPY_MD_FORMAT":
        this.writeClipBoard(tab.id, `[${newTitle}](${url})`);

        /* @__PURE__ */
        console.log("PageTweeter: Copy to ClipBoard! MarkDown style.");
        break;

      case "COPY_ONLY_TITLE":
        this.writeClipBoard(tab.id, newTitle);

        /* @__PURE__ */
        console.log("PageTweeter: Copy to ClipBoard! only Title.");
        break;

      case "COPY_NO_PARAM_URL":
        this.writeClipBoard(tab.id, url);

        /* @__PURE__ */
        console.log("PageTweeter: Copy to ClipBoard! only removed param URL.");
        break;

      default:
        throw new Error("Error! case is not exist.");
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
    } catch (err) {
      await this.notifyError(1);
      console.info(err);
    }
  },

  /**
   * Notify unavailable message.
   * @param {number} type
   */
  async notifyError(type: number) {
    const id = "PageTweeterNotification";

    /* @__PURE__ */
    console.log(id);

    chrome.notifications.clear(id);

    const notifyOptions: chrome.notifications.NotificationOptions<true> = {
      title: "Page Tweeter",
      message: "",
      iconUrl: chrome.runtime.getURL("PTicon.png"),
      type: "basic",
      requireInteraction: true,
    };

    switch (type) {
      case 0: {
        notifyOptions.message =
          chrome.i18n.getMessage<I18nMessageType>("error_0");
        notifyOptions.contextMessage = "[Error] Unavailable scheme";
        break;
      }
      case 1: {
        notifyOptions.message =
          chrome.i18n.getMessage<I18nMessageType>("error_1");
        notifyOptions.contextMessage = "[Error] Could not write to Clipboard";
        break;
      }
      default: {
        notifyOptions.message =
          chrome.i18n.getMessage<I18nMessageType>("error_0");
      }
    }

    await chrome.notifications.create(id, notifyOptions);
  },
};
