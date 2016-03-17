width = 550;
height = 420;
winHeight = screen.height;
winWidth = screen.width;

function tweet(){
    console.log("Hello!!");
    
    var tabs = chrome.tabs.getSelected(null,function(tab){
        console.log('tweet page!: ' + tab.url);
	    console.log('tab title: '+ tab.title);
        url = encodeURIComponent(tab.url);
	    title = encodeURI(tab.title);
        
        var left = Math.round((winWidth / 2) - (width / 2));
        var top = 0;
 
        if (winHeight > height) {
          top = Math.round((winHeight / 2) - (height / 2));
        }
        //console.log("https://twitter.com/intent/tweet?original_referer="+url+"&ref_sec=twsrc%5Etfw&text="+title+"&tw_p=tweetbutton&url="+url);
	    //window.open("https://twitter.com/intent/tweet?original_referer="+url+"&ref_sec=twsrc%5Etfw&text="+title+"&tw_p=tweetbutton&url="+url);
        //window.open("https://twitter.com/intent/tweet?text="+title+"%20"+url, "","width="+width+",height="+height+",left="+left+",top="+top+",alwaysRaised=yes");
        window.open("https://twitter.com/intent/tweet?text="+title+"%20"+url);
    });
}