var windowOptions = "scrollbars=yes,resizable=yes,toolbar=no,location=yes",
    winHeight = screen.height,
    winWidth = screen.width;

chrome.runtime.onMessage.addListener(function(mes, sender, sendResponse){
    console.log("PageTweeter: Create Tweet Window!");
    
    //表示位置設定
    var width = 550,
        height = 420,
        left = Math.round((winWidth / 2) - (width / 2)),
        top = 0;
    
    if (winHeight > height) {
        top = Math.round((winHeight / 2) - (height / 2));
    }
    
    window.open(
        "https://twitter.com/intent/tweet?text=" + mes.title + "&url=" + mes.url + "&related=yuzarkfox%3APageTweeter%20created%20by",
        "intent",
        windowOptions + ",left=" + left + ",top=" + top + ",width=" + width + ",height=" + height
    );
    
    return true;
});