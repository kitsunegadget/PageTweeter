import { notifyError } from "./notifications";

type OgpProp = "title" | "url";

export const Utils = {
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
        console.info(err);
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
      await notifyError("COPY_FAILED");
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(err);
      }
    }
  },
};
