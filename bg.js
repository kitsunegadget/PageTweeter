chrome.runtime.onInstalled.addListener(function(){
    chrome.contextMenus.create({
        id: "tweet_page", 
        title: "このページをツイートする"
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
});

chrome.contextMenus.onClicked.addListener(function(info,tab){
    var url = encodeURIComponent(tab.url),
        title = encodeURI(tab.title);
        
    switch(info.menuItemId){
        case "tweet_page":
            console.log("id:tweet_page の onClickイベント!");
            chrome.tabs.sendMessage(
                tab.id,
                { area: "tweet", url: url, title: title }
            ); 
            break;
        case "copy_clip":
            console.log("id:copy_clip の onClickイベント!");
            chrome.tabs.sendMessage(
                tab.id,
                { area: "copy", url: tab.url, title: tab.title }
            ); 
            break;
        default:
            console.log("Error! case no exist.");
    }
});
