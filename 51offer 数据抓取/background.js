function getDomainFromUrl(url) {
    var host = "null";
    if (typeof url == "undefined" || null == url)
        url = window.location.href;
    var regex = /.*\:\/\/([^\/]*).*/;
    var match = url.match(regex);
    if (typeof match != "undefined" && null != match)
        host = match[1];
    return host;
}

/**
 * 选项卡切换时触发事件
 * @param  {[type]} tabId      [description]
 * @param  {[type]} changeInfo [description]
 * @param  {[type]} tab)       {               if(getDomainFromUrl(tab.url).toLowerCase() [description]
 * @return {[type]}            [description]
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (getDomainFromUrl(tab.url).toLowerCase() == "www.51offer.com") {
        //chrome.pageAction.show(tabId);
    }
});

/**
 * 插件工具栏图标点击事件
 * @param  {[type]} tab) {               console.log('open');    var url [description]
 * @return {[type]}      [description]
 */
chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('open');
    var url = chrome.extension.getURL('option.html');
    window.open(url);


    /**
     * 发送消息
     * @param  {[type]} response) {                           console.log(response);    } [description]
     * @return {[type]}           [description]
     */
    chrome.tabs.sendMessage(tab.id, {
            greeting: "do something in contentscript!"
        },
        function(response) {
            /** 回调函数，用来处理请求返回的json对象:response **/
            console.log(response);
        });
});

/**
 * 消息监听
 * @param  {[type]} request       [description]
 * @param  {[type]} sender        [description]
 * @param  {[type]} sendResponse) {                  if (request.greeting [description]
 * @return {[type]}               [description]
 */
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    if (request == "第一次发送") {
        sendResponse({
            question: "第一次接受并响应"
        });
    } else if (request == "第二次发送") {
        sendResponse({
            question: "第二次接受并响应"
        });
    }
});

chrome.extension.onConnect.addListener(function(port) {
    console.assert(port.name == "knockknock");
    port.onMessage.addListener(function(msg) {
        if (msg.joke == "Knock knock")
            port.postMessage({
                question: "Who's there?"
            });
        else if (msg.answer == "Madame")
            port.postMessage({
                question: "Madame who?"
            });
        else if (msg.answer == "Madame... Bovary")
            port.postMessage({
                question: "I don't get it."
            });
    });
});