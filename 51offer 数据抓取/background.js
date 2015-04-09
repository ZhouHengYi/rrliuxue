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
    if (request.status == 1) {

        if (!window.schoolList) {
            window.schoolList = request.schoolList;
        }
        start(request, sender)
    }
});

/**
 * [start description]
 * @param  {[type]} evt    [description]
 * @param  {[type]} sender [description]
 * @return {[type]}        [description]
 */
function start(evt, sender) {
    //do massive job.在这里你进行大量耗时的计算过程。
    //循环所有该国家专业信息
    //每个专业进行全部数据匹配
    //所有学校所有专业匹配
    //访问51offer进行查询记录结果
    //比较耗时，操蛋
    var url = buildUrl(evt.scountry, evt.sarea, 1);
    run(evt, 0, url);
    localStorage.schoolList = JSON.stringify(window.schoolList);

}

/**
 * 递归循环所有专业
 * @param  {[type]} evt [description]
 * @param  {[type]} i   [description]
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function run(evt, i, url) {
    if (i < evt.major.length) {
        var data = {
            rankmajorsName: evt.major[i].direction,
            rankmajorName: evt.major[i].type,
            type: 'UpdateMajorHtml'
        }

        //更新专业选项卡
        //chrome.tabs.sendMessage(evt.tabId, data,
        //    function(response) {
        //        /** 回调函数，用来处理请求返回的json对象:response **/
        //        console.log(response);
        //    });

        //console.log(url);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.responseText.length > 0) {
                //console.log(xhr.responseText);
                ///获取所有页数
                var pageIndex = $(xhr.responseText).find("#next a").last().prev().html();
                if (pageIndex) {
                    for (var i = 1; i < pageIndex; i++) {
                        //setTimeout(function() {
                        localStorage.pageIndex = i;
                        var url = buildUrl();
                        eachMajor(url, data)
                            //}, 100);
                    }
                    i++;
                    run(evt, i, url);
                } else {
                    localStorage.pageIndex = 1;
                    var url = buildUrl();
                    eachMajor(url, data);
                    i++;
                    run(evt, i, url);
                }
            }
        }
        xhr.send(data);
    }
}

/**
 * [description]
 * @param  {[type]} port) {               console.assert(port.name [description]
 * @return {[type]}       [description]
 */
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

/**
 * 获取某专业的所有学校信息进行匹配
 * @param  {[type]} url    [description]
 * @param  {[type]} entity [description]
 * @return {[type]}        [description]
 */
function eachMajor(url, entity) {
    $.ajax({
        url: url,
        type: "POST",
        data: entity,
        timeout: 5000,
        async: false,
        error: function(ex) {
            //tzMsg(ex.statusText);
        },
        success: function(result) {
            //获取学校列表
            var list = $(result).find(".schoolLabel li");
            //循环每条学校数据进行记录
            for (var i = 0; i < $(list).length; i++) {
                //获得学校名称进行数据集合匹配
                var schoolNameCh = $(list[i]).find(".schoolNameEn").eq(0).find("strong").html();
                //综合排名
                var g = removeAllSpace($(list[i]).find(".allRank .rank").eq(0).html());
                //专业排名
                var m = removeAllSpace($(list[i]).find(".pRank .rank").eq(0).html());


                for (var k = 0; k < window.schoolList.length; k++) {
                    //根据名称判断是否对应学校
                    if (window.schoolList[k].schoolNameCh == schoolNameCh) {
                        for (var l = 0; l < window.schoolList[k].Major.length; l++) {
                            if (window.schoolList[k].Major[l].direction == entity.rankmajorsName && window.schoolList[k].Major[l].type == entity.rankmajorName) {
                                window.schoolList[k].Major[l].grank = g;
                                window.schoolList[k].Major[l].mrank = m;
                                console.log("学校：" + schoolNameCh + "，专业：" + window.schoolList[k].Major[l].direction + " - " + window.schoolList[k].Major[l].type + " 综合排名：" + g + "  专业排名：" + m);
                                break;
                            }
                        }
                    }
                }
            }
        }
    });
}

function buildUrl() {
    var url = "http://www.51offer.com/school/{scountry}-{sarea}-{pageIndex}.html?&linestauts=2";
    url = url.replace('{scountry}', localStorage.scountry);
    url = url.replace('{sarea}', localStorage.sarea);
    url = url.replace('{pageIndex}', localStorage.pageIndex);
    return url;
}

function removeAllSpace(str) {
    if (str) {
        return str.replace(/\s+/g, "");
    } else {
        return "";
    }
}