let bg = chrome.extension.getBackgroundPage();

window.onload = function(){
    chrome.tabs.query({active: true, currentWindow:true}, (tabs) => {
        tab = tabs[0];
        console.log(tab);

        document.getElementById("tweet").onclick=()=>{
            sendMessage(tab, "tweet", 0);
        };
    
        document.getElementById("copy").onclick=()=>{
            sendMessage(tab, "copy", 0);
        };
    }); //ここで読み込まないと他より先に読めない…
};

function sendMessage(tab, area, subArea){
    chrome.tabs.sendMessage(
        tab.id,
        { area: area, subArea: subArea, url: tab.url, title: tab.title },
        (response)=>{
            if(response === undefined){ bg.popupAlert();}
        }
    );
    //window.close();
};
