chrome.browserAction.onClicked.addListener(function(tab){
	console.log('tweet page!: ' + tab.url);
	console.log('tab title: '+ tab.title);
	//chrome.tabs.executeScript(null,{file: "setup_twttr.js"});
	var url = encodeURIComponent(tab.url);
	var title = encodeURI(tab.title);
	console.log("https://twitter.com/intent/tweet?original_referer="+url+"&ref_sec=twsrc%5Etfw&text="+title+"&tw_p=tweetbutton&url="+url);
	window.open("https://twitter.com/intent/tweet?original_referer="+url+"&ref_sec=twsrc%5Etfw&text="+title+"&tw_p=tweetbutton&url="+url);
});