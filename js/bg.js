chrome.runtime.onInstalled.addListener(function(){
    chrome.contextMenus.create({
        id: "tweet_page", 
        title: "このページをツイート"
    },
        function(){
        console.log("コンテキストメニュー(tweet_page)を登録したよ！");
    });
    chrome.contextMenus.create({
        id: "copy_clip", 
        title: "クリップボードにコピー"
    },
        function(){
        console.log("コンテキストメニュー(copy_clip)を登録したよ！");
    });
    /*
    chrome.contextMenus.create({
        id: "child",
        parentId: "tweet_page", 
        title: "子要素"
    },
        function(){
        console.log("コンテキストメニュー(child)を登録したよ！");
    });
    */
    
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
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

chrome.contextMenus.onClicked.addListener(function(info,tab){
        
    switch(info.menuItemId){
        case "tweet_page":
            console.log("id:tweet_page の onClickイベント!");
            chrome.tabs.sendMessage(
                tab.id,
                { area: "tweet", url: tab.url, title: tab.title },
                function(response){
                    if(response === undefined){ popupAlert(); } 
                }
            ); 
            break;
        case "copy_clip":
            console.log("id:copy_clip の onClickイベント!");
            chrome.tabs.sendMessage(
                tab.id,
                { area: "copy", url: tab.url, title: tab.title },
                function(response){
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
