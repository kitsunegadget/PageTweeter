$(function(){
 
    $('#tweet').click(function(){
        var bgWindow = chrome.runtime.getBackgroundPage(function(bg){
            bg.tweet();
           
        });
    });
});