chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "tweet_page", 
        title: "このページをツイート"
    },
        () => { 
        console.log("コンテキストメニュー(tweet_page)を登録したよ！");
    });
    chrome.contextMenus.create({
        id: "copy_clip", 
        title: "クリップボードにコピー"
    },
        () => {
        console.log("コンテキストメニュー(copy_clip)を登録したよ！");
    });
    chrome.contextMenus.create({
        id: "others",
        title: "その他"
    },
        () => {
        console.log("コンテキストメニュー(others)を登録したよ！");
    });
    //子要素
    chrome.contextMenus.create({
        id: "copy_title",
        parentId: "others",
        title: "ページタイトルのみをコピー"
    },
        () => {
        console.log("コンテキストメニュー(copy_title)を登録したよ！");
    });
    
    //ページ制限
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { schemes:  ["http","https"] }
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction() ]
        }]);
    })
});

chrome.contextMenus.onClicked.addListener((info,tab) => {
        
    switch(info.menuItemId){
        case "tweet_page":
            console.log("id:tweet_page の onClickイベント!");
            chrome.tabs.sendMessage(
                tab.id,
                { area: "tweet", subArea: 0, url: tab.url, title: tab.title },
                (response) => {
                    if(response === undefined){ popupAlert(); } 
                }
            ); 
            break;
        case "copy_clip":
            console.log("id:copy_clip の onClickイベント!");
            chrome.tabs.sendMessage(
                tab.id,
                { area: "copy", subArea: 0, url: tab.url, title: tab.title },
                (response) => {
                    if(response === undefined){ popupAlert(); } 
                }
            ); 
            break;
        case "copy_title":
            console.log("id:copy_title の onClickイベント!");
            chrome.tabs.sendMessage(
                tab.id,
                { area: "copy", subArea: 1, url: tab.url, title: tab.title },
                (response) => {
                    if(response === undefined){ popupAlert(); }
                }
            );
            break;
        default:
            console.log("Error! case is not exist.");
    }
});

function popupAlert(){
    alert("現在のページでは利用できません。");
}
/*
chrome.tabs.onUpdated.addListener(function(tabId){
    chrome.pageAction.show(tabId);
});
*/
