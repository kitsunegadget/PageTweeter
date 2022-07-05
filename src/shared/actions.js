"use strict";

// importScript読み込み時に、グローバルスコープで扱えるようにする
console.log("imported script!");
self.pageTweeterActions = {
  get windowOptions() {
    return "scrollbars=yes,resizable=yes,toolbar=no,location=yes";
  },

  get screenHeight() {
    const screenWrap = async () => {
      if (self.hasOwnProperty("screen")) {
        return screen.height;
      } else {
        const displayInfo = await chrome.system.display.getInfo();
        if (displayInfo) return displayInfo[0].bounds.height;

        return 1920;
      }
    };

    return screenWrap();
  },

  get screenWidth() {
    const screenWrap = async () => {
      if (self.hasOwnProperty("screen")) {
        return screen.width;
      } else {
        const displayInfo = await chrome.system.display.getInfo();
        if (displayInfo) return displayInfo[0].bounds.width;

        return 1080;
      }
    };

    return screenWrap();
  },

  checkUrlScheme(tab) {
    // 共有すると危ういURLはバイパスさせる
    return /^http(s|):\/\/.*\/.*/g.test(tab.url);
  },

  /**
   * Create tweet window.
   * @param {chrome.tabs.Tab} tab
   */
  async createTweetWindow(tab) {
    if (!this.checkUrlScheme(tab)) {
      this.notifyError(0);
      return;
    }

    // 表示位置設定
    const width = 550;
    const height = 570;
    const left = Math.round((await this.screenWidth) / 2 - width / 2);
    let top = 0;

    if (this.winHeight > height) {
      top = Math.round((await this.screenHeight) / 2 - height / 2);
    }

    console.log(await this.screenWidth, await this.screenHeight);

    // 文字数制限
    let shortenTitle = "";
    if (tab.title.length + 48 > 140) {
      shortenTitle = tab.title.substring(0, 140 - 48) + "...";
    } else {
      shortenTitle = tab.title;
    }

    // エンコード
    const url = encodeURIComponent(tab.url);
    const title = encodeURIComponent(shortenTitle);

    chrome.windows.create({
      url: `https://twitter.com/intent/tweet?text=${title}&url=${url}&related=kitsunegadget%3APageTweeter%20created%20by`,
      width: width,
      height: height,
      top: top,
      left: left,
      type: "popup",
    });

    console.log("PageTweeter: Create Tweet Window!");
  },

  /**
   * Copy to string.
   * @param {chrome.tabs.Tab} tab
   * @param {boolean} onlyTitle
   */
  async copy(tab, onlyTitle = false) {
    if (!this.checkUrlScheme(tab)) {
      this.notifyError(0);
      return;
    }

    if (onlyTitle) {
      this.writeClipBoard(tab.id, tab.title);
      console.log("PageTweeter: Copy to ClipBoard! only Title.");
    } else {
      this.writeClipBoard(tab.id, `${tab.title} ${tab.url}`);
      console.log("PageTweeter: Copy to ClipBoard!");
    }
  },

  /**
   * Apply writing to the ClipBoard.
   * @param {number} tabId chrome Tab id.
   * @param {string} text write text.
   */
  async writeClipBoard(tabId, text) {
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
  async notifyError(type) {
    const id = `PageTweeter${(1000 + Math.random() * 8999).toFixed()}`;
    console.log(id);

    if (type === 0) {
      chrome.notifications.create(id, {
        title: "PageTweeter",
        message: "Unavailable on this page.",
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
        console.error(err);
      }
    } else {
      setTimeout(() => {
        chrome.notifications.clear(id);
      }, 6500);
    }
  },
};
