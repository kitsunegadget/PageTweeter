window.onload = function(){
    
    let tab;
    chrome.tabs.query({active:true}, (tabs) => {
        tab = tabs[0];
        console.log(tab);
    }); //ここで読み込まないと他より先に読めない…
    let bg = chrome.extension.getBackgroundPage();
    
    document.getElementById("tweet").onclick=()=>{
        chrome.tabs.sendMessage(
            tab.id,
            { area: "tweet", subArea:0, url: tab.url, title: tab.title },
            (response)=>{
                if(response === undefined){ bg.popupAlert(); }
            }
        );
        window.close();
    };
    
    document.getElementById("copy").onclick=()=>{
        chrome.tabs.sendMessage(
            tab.id,
            { area: "copy", subArea:0, url: tab.url, title: tab.title },
            (response)=>{
                if(response === undefined){ bg.popupAlert();}
            }
        );
        window.close();
    };
};
