/**
 * Notify error messages.
 */
export async function notifyError(errorType: ErrorType) {
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
}
