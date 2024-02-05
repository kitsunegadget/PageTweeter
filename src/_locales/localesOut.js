import fs from "node:fs";
import { i18nMessages } from "./locales.js";

/**
 * For build pre process to output messages.json from locales.js.
 * @param {string} outBaseDir Output base directory.
 */
export function outLocaleMessages(outBaseDir) {
  const localeCodes = Object.keys(i18nMessages.extension_description);

  for (const localeCode of localeCodes) {
    const newMessages = {};
    for (const name in i18nMessages) {
      Object.defineProperty(newMessages, name, {
        value: { message: i18nMessages[name][localeCode] },
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }

    const stringified = JSON.stringify(newMessages);
    const folderPath = `./${outBaseDir}/_locales/${localeCode}`;

    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      fs.writeFileSync(`${folderPath}/messages.json`, stringified);
    } catch (err) {
      throw new Error(err);
    }
  }
}
