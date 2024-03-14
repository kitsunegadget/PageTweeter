import { Actions } from "./actions";
import { notifyError } from "./notifications";
import { Utils } from "./utils";

export async function runActions(tab: DefinedTab, actionType: ActionType) {
  // OGP があれば、そちらを利用
  tab.title = (await Utils.getOgpContent("title", tab.id)) ?? tab.title;
  const ogpUrl = await Utils.getOgpContent("url", tab.id);
  const hasOgpURL = typeof ogpUrl === "string";
  tab.url = ogpUrl ?? tab.url;

  if (!Utils.checkUrlScheme(tab.url)) {
    await notifyError("UNAVAILABLE_SCHEME");
    throw new Error(`Unavailable Scheme: ${tab.url}`);
  }

  switch (actionType) {
    case "TWEET":
      await Actions.createTweetWindow(tab);
      break;

    case "BSKY":
      await Actions.createBskyTab(tab);
      break;

    case "FACEBOOK":
      await Actions.createFacebookWindow(tab);
      break;

    case "HATENA":
      await Actions.createHatenaTab(tab);
      break;

    case "NOTE":
      await Actions.createNoteTab(tab);
      break;

    case "COPY":
    case "COPY_MD_FORMAT":
    case "COPY_ONLY_TITLE":
      await Actions.copy(tab, actionType);
      break;

    case "COPY_NO_PARAM_URL":
      // OGPが利用できる場合は、パラメーター削除の必要がない
      await Actions.copy(tab, actionType, !hasOgpURL);
      break;

    default:
      throw new Error(actionType satisfies never);
  }
}
