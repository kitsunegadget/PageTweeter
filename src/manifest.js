import fs from "node:fs";

const manifest = {
  manifest_version: 3,
  name: "Page Tweeter",
  version: "5.1",
  default_locale: "en",
  description: "__MSG_extension_description__",
  icons: {
    16: "PTicon.png",
    48: "PTicon.png",
    128: "PTicon.png",
  },
  author: "Yu, Kitsune Gadget",
  background:
    process.env.npm_lifecycle_event === "esprod-firefox"
      ? { scripts: ["sw.js"], persistent: false }
      : {
          service_worker: "sw.js",
          type: "module",
        },
  action: {
    default_title: "Page Tweeter",
    default_popup: "popup/popup.html",
  },
  permissions: [
    "activeTab",
    "contextMenus",
    "declarativeContent",
    "system.display",
    "scripting",
    "notifications",
  ],
};

export function createManifest(outBaseDir) {
  const stringified = JSON.stringify(manifest);
  const folderPath = `./${outBaseDir}`;

  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    fs.writeFileSync(`${folderPath}/manifest.json`, stringified);
  } catch (err) {
    throw new Error(err);
  }
}
