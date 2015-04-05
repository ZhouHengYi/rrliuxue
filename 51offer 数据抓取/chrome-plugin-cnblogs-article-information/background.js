function getDomainFromUrl(url){
    var host = "null";
    if(typeof url == "undefined" || null == url)
        url = window.location.href;
    var regex = /.*\:\/\/([^\/]*).*/;
    var match = url.match(regex);
    if(typeof match != "undefined" && null != match)
        host = match[1];
    return host;
}


function checkForValidUrl(tabId, changeInfo, tab) {
    if(getDomainFromUrl(tab.url).toLowerCase()=="www.51offer.com"){
        //chrome.pageAction.show(tabId);
    }
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('open');
    var url = chrome.extension.getURL('option.html');
    window.open(url);
});

var articleData = {};
articleData.error = "加载中...";
chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
    if(request.type!=="article-information")
        return;
    articleData = request;
    articleData.firstAccess = "获取中...";
    if(!articleData.error){
        $.ajax({
            url: articleData.url,
            cache: false,
            type: "GET",
            dataType: "json"
        }).done(function(msg) {
            if(msg.error){
                articleData.firstAccess = msg.error;
            } else {
                articleData.firstAccess = msg.firstAccess;
            }
        }).fail(function(jqXHR, textStatus) {
            articleData.firstAccess = textStatus;
        });
    }
});
