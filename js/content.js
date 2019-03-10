const windowOptions = "scrollbars=yes,resizable=yes,toolbar=no,location=yes",
    winHeight = screen.height,
    winWidth = screen.width;

chrome.runtime.onMessage.addListener( (m, sender, sendResponse) => {
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
    sendResponse("ok!");
});

function tweet(m){
    console.log("PageTweeter: Create Tweet Window!");
    
    //表示位置設定
    let width = 550,
        height = 420,
        left = Math.round((winWidth / 2) - (width / 2)),
        top = 0;
    
    if (winHeight > height) {
        top = Math.round((winHeight / 2) - (height / 2));
    }
    
    //文字数制限
    let newtitle;
    if(m.title.length + 48 > 140){
        newtitle = m.title.substring(0, 140-48) + "...";
    } else {
        newtitle = m.title;
    }
    
    //エンコード
    let url = encodeURIComponent(m.url);
        title = encodeURIComponent(newtitle);
        
    window.open(
        "https://twitter.com/intent/tweet?text=" + title + "&url=" + url + "&related=kitsunegadget%3APageTweeter%20created%20by",
        "intent",
        windowOptions + ",left=" + left + ",top=" + top + ",width=" + width + ",height=" + height
    );
}

function copy(m){
    console.log("PageTweeter: Copy to ClipBoard!");
    
    //テキストエリアを埋め込んで選択範囲にして、コピーを実行（むりやり？^^;）
    let element = document.createElement('textarea');
    if (m.subArea === 0) {
        element.innerText = m.title + " " + m.url;
    } 
    else if (m.subArea === 1) {
        element.innerText = m.title;
    }
    
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    element.remove();
}