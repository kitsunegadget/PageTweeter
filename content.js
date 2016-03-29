var windowOptions = "scrollbars=yes,resizable=yes,toolbar=no,location=yes",
    winHeight = screen.height,
    winWidth = screen.width;

chrome.runtime.onMessage.addListener(function(m, sender, sendResponse){
    switch(m.area){
        case "tweet":
            tweet(m);
            break;
        case "copy":
            copy(m);
            break;
        default:
            console.log("Error...");
    }
});

function tweet(m){
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
        "https://twitter.com/intent/tweet?text=" + m.title + "&url=" + m.url + "&related=yuzarkfox%3APageTweeter%20created%20by",
        "intent",
        windowOptions + ",left=" + left + ",top=" + top + ",width=" + width + ",height=" + height
    );
}

function copy(m){
    console.log("PageTweeter: Copy to ClipBoard!");
    
    //テキストエリアを埋め込んで選択範囲にして、コピーを実行（むりやり^^;）
    var element = document.createElement('textarea');
    element.innerText = m.title + " " + m.url;
    document.body.appendChild(element);
    
    element.focus();
    element.select();
    document.execCommand('copy');
    element.remove();
}