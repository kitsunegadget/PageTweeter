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
   * スキームのチェック
   * @param {string} url A URL string.
   * @returns {boolean} Only "http" or "https" scheme is true.
   */
  checkUrlScheme(url: string): boolean {
    return /^http(s|):\/\/.+?\/.*/g.test(url);
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
   * Create tweet window.
   * @param {DefinedTab} tab
   */
  async createTweetWindow(tab: DefinedTab) {
    if (!this.checkUrlScheme(tab.url)) {
      this.notifyError(0);
      return;
    }

    // 表示位置設定
    const width = 550;
    const height = 570;
    const left = Math.round((await this.screenWidth) / 2 - width / 2);
    let top = 0;

    if ((await this.screenHeight) > height) {
      top = Math.round((await this.screenHeight) / 2 - height / 2);
    }

    /* @__PURE__ */
    console.log(await this.screenWidth, await this.screenHeight);

    // 文字数制限
    const shortenTitle =
      tab.title.length + 48 > 140
        ? tab.title.slice(0, 140 - 48) + "..."
        : tab.title;

    // URL 作成
    const intentURL = new URL("https://twitter.com/intent/tweet");
    intentURL.searchParams.set("text", shortenTitle);
    intentURL.searchParams.set("url", tab.url);
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
   * Copy to string.
   * @param {DefinedTab} tab A copy url from tab.
   * @param {ActionType} actionType An action type.
   * @param {boolean} remParam Flag to remove parameter.
   */
  async copy(
    tab: DefinedTab,
    actionType: ActionType = "COPY",
    remParam: boolean = false
  ) {
    if (!this.checkUrlScheme(tab.url)) {
      this.notifyError(0);
      return;
    }

    const url = remParam ? this.removeParameter(tab.url) : tab.url;

    switch (actionType) {
      case "COPY": {
        this.writeClipBoard(tab.id!, `${tab.title} ${url}`);

        /* @__PURE__ */
        console.log("PageTweeter: Copy to ClipBoard!");
        break;
      }
      case "COPY_MD_FORMAT":
        this.writeClipBoard(tab.id, `[${tab.title}](${url})`);

        /* @__PURE__ */
        console.log("PageTweeter: Copy to ClipBoard! MarkDown style.");
        break;

      case "COPY_ONLY_TITLE":
        this.writeClipBoard(tab.id, tab.title);

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
      this.notifyError(0);
      console.info(err);
    }
  },

  /**
   * Notify unavailable message.
   * @param {number} type
   */
  async notifyError(type: number) {
    const id = `PageTweeter${(1000 + Math.random() * 8999).toFixed()}`;

    /* @__PURE__ */
    console.log(id);

    if (type === 0) {
      chrome.notifications.create(id, {
        title: "Page Tweeter",
        message: chrome.i18n.getMessage("error_text_0"),
        iconUrl: chrome.runtime.getURL("PTicon.png"),
        type: "basic",
      });
    }

    // popupではクリック後に閉じるため処理できないので、サービスワーカーに
    // メッセージングして譲る
    if (self.toString() === "[object Window]") {
      try {
        await chrome.runtime.sendMessage({
          type: "clearNotify",
          id: id,
        });
      } catch (err) {
        throw new Error(err as string);
      }
    } else {
      setTimeout(() => {
        chrome.notifications.clear(id);
      }, 6500);
    }
  },
};
