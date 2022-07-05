import "../shared/actions";

const dev = process.env.NODE_ENV === "development";

window.onload = async function () {
  const tabs = await chrome.tabs
    .query({
      active: true,
      currentWindow: true,
    })
    .catch((err) => {
      throw err;
    });

  const tab = tabs[0];
  if (dev) console.log(tab); // dev log

  document.getElementById("tweet").onclick = () => {
    pageTweeterActions.createTweetWindow(tab);
    if (!dev) window.close();
  };

  document.getElementById("copy").onclick = () => {
    pageTweeterActions.copy(tab);
    if (!dev) window.close();
  };

  document.getElementById("copy-title").onclick = () => {
    pageTweeterActions.copy(tab, true);
    if (!dev) window.close();
  };
};
