/**
 * 添加页面内容加载完成事件
 * @param  {[type]} ) {	console.log('popup.js')	var data [description]
 * @return {[type]}   [description]
 */
document.addEventListener('DOMContentLoaded', function() {
	/**
	console.log('popup.js')
	var data = chrome.extension.getBackgroundPage().articleData;

	if(data.error){
		$("#message").text(data.error);
		$("#content").hide();
	}else{
		$("#message").hide();
		$("#content-title").text(data.title);
		$("#content-author").text(data.author);
		$("#content-date").text(data.postDate);
		$("#content-first-access").text(data.firstAccess);
	}
	*/
});

/**
 localStorage = {
 	scountry:'',
 	cname:'',
 	sarea:'',
 	major1:'',
 	major2:''
 };
 * 当前国家
 * @type {[type]}
 localStorage.scountry = '';
 * 学校名称
 * @type {String}
 localStorage.cname = '';
 * 地区
 * @type {String}
 localStorage.sarea = '';
 * 专业排名-
 * @type {String}
 localStorage.major1 = '';
 * 专业排名-
 * @type {String}
 localStorage.major2 = '';
*/
/**
 *
 * @param  {[type]} ){	$(".tab_sel").click(function(){		$(this).next().show();	});	loadRank(scountry);		$("#scountry a").click(function(){		scountry [description]
 * @return {[type]}                                                                                                     [description]
 */

/**
 * [schoolList description]
 * @type {Array}
 *
 * schoolList.schoolNameCh
 * --
 * schoolList.Major.id
 * schoolList.Major.keywords
 * schoolList.Major.type_en
 * schoolList.Major.direction
 * schoolList.Major.type
 * schoolList.Major.country
 */

/**
 * 消息监听，接受background发送的消息
 * @param  {[type]} request                                  [description]
 * @param  {[type]} sender                                   [description]
 * @param  {[type]} senderResponse){	console.log("receiving request       comes from extension...");	if(request.greeting [description]
 * @return {[type]}                                          [description]
 */
chrome.runtime.onMessage.addListener(function(request, sender, senderResponse) {
	console.log("receiving request comes from extension...");

	if (request.greeting === "do something in contentscript!") {
		senderResponse("ok");
	} else {
		senderResponse("error");
	}
})



var schoolList;

$(function() {
	if (!localStorage.scountry) {
		localStorage.scountry = $("#scountry .active").attr("id");
	}
	if (!localStorage.sarea) {
		localStorage.sarea = "all";
	}


	loadRank(localStorage.scountry);
	init();
	bindEvent();
});

/**
 * [init description]
 * @return {[type]} [description]
 */
function init() {
	//初始化国家
	$("#scountry a").removeClass("active");
	$("#" + localStorage.scountry).addClass("active");

	//初始化Table－专业数据
	bindTableMajor();


	//初始化所选地区
	if (localStorage.sarea && localStorage.sarea.length > 0) {
		$("[data-id='" + localStorage.scountry + "']").show();
		$("[data-id='" + localStorage.scountry + "'] a").removeClass("active");
		$("[data-area='" + localStorage.sarea + "']").addClass("active");
	}

	//初始化当前页码
	localStorage.pageIndex = 1;
	localStorage.sTotalCount = 1;
}

/**
 * 绑定事件
 * @return {[type]} [description]
 */
function bindEvent() {
	/**
	 * 专业排名事件处理
	 * @param  {[type]} ){ 		$(this).next().show(); 	} [description]
	 * @return {[type]}     [description]
	 */
	$(".tab_sel").click(function() {
		$(this).next().show();
	});
	//国家切换事件
	$("#scountry a").click(function() {
		localStorage.scountry = $(this).attr("id");
		$("#scountry a").removeClass("active");
		$(this).addClass("active");
		$("[name='sarea']").hide();
		$("[data-id='" + localStorage.scountry + "']").show();
		loadRank(localStorage.scountry);
		//初始化Table－专业数据
		bindTableMajor();
	});

	//地区数据展示
	$("[name='sarea'] a").click(function() {
		$(this).parent().find("a").removeClass("active");
		$(this).addClass("active");
		localStorage.sarea = $(this).attr("data-area");
	});

	/**
	 * 搜索按钮事件
	 * @param  {[type]} ) {		localStorage.pageIndex [description]
	 * @return {[type]}   [description]
	 */
	$("#div_search").click(function() {
		localStorage.pageIndex = 1;
		//search();
		$(".searchChil").show();
		$("#div_school1").click();
		eachSearch();
	});

	/**
	 * 数据列表视图切换
	 * @param  {[type]} event) {		$(this).addClass("active");		$("#div_school2").removeClass("active");		$("#school2").hide();		$("#school1").show();	} [description]
	 * @return {[type]}        [description]
	 */
	$("#div_school1").click(function(event) {
		$(this).addClass("active");
		$("#div_school2").removeClass("active");
		$("#school2").hide();
		$("#school1").show();
	});

	/**
	 * 数据列表视图切换
	 * @param  {[type]} event) {				$(this).addClass('active');		$("#div_school1").removeClass("active");		$("#school1").hide();		$("#school2").show();	} [description]
	 * @return {[type]}        [description]
	 */
	$("#div_school2").click(function(event) {
		/* Act on the event */
		$(this).addClass('active');
		$("#div_school1").removeClass("active");
		$("#school1").hide();
		$("#school2").show();
	});

	$("#div_setTable").click(function(event) {
		sendMessageToBackground("第一次发送");

		if (!schoolList || schoolList == null) {
			alert('请先全部获取一次数据再进行操作..!');
			return;
		}

		//初始化需要依赖的数据
		var data = {
			msg: '开始抓取专业排名数据',
			major: getMajor(),
			scountry: localStorage.scountry,
			ukrank: ukrank,
			aurank: aurank,
			sarea: localStorage.sarea
		};

		//WEB页主线程
		var worker = new Worker("js/job.js"); //创建一个Worker对象并向它传递将在新线程中执行的脚本的URL
		worker.postMessage(data);
		worker.onmessage = function(evt) { //接收worker传过来的数据函数
			//callbak();
			if (evt.data.type == "UpdateMajorHtml") {
				$("#major1").html(evt.data.rankmajorsName);

				if (localStorage.scountry == "uk") {
					bindRankByType(ukrank, evt.data.rankmajorsName);
				} else if (localStorage.scountry == "au") {
					bindRankByType(aurank, evt.data.rankmajorsName);
				}
				$("#major2").html(evt.data.rankmajorName);
			} else if (evt.data.type == "ajaxMajor") {
				ajaxMajor(evt.data.url, evt.data.entity);
			}
			//console.log("popup.js - onmessage " + evt); //输出worker发送来的数据，这里就获取到了大量计算的结果。

		}
	});
}

/**
 * 发送消息到Background
 * @param  {[type]} request      [description]
 * @param  {[type]} sender       [description]
 * @param  {[type]} sendResponse [description]
 * @return {[type]}              [description]
 */
function sendMessageToBackground(request, sender, sendResponse) {
	// body...
	chrome.extension.sendMessage(request, function(response) {
		//console.log("popup.js chrome.extension.sendMessage");
		console.log(response.question);

		if(response.question == "第一次接受并响应"){
			
		}

	});
}
				
var port = chrome.extension.connect({
	name: "knockknock"
});

port.postMessage({
	joke: "Knock knock"
});
/**
 * Long-lived connections 长周期连接 
	能够保持连接,持续的进行数据收发 
	从content script 连接到background(插件)的代码 
 * @type {[type]}
 */
port.onMessage.addListener(function(msg) {
	if (msg.question == "Who's there?")
		port.postMessage({
			answer: "Madame"
		});
	else if (msg.question == "Madame who?")
		port.postMessage({
			answer: "Madame... Bovary"
		});
});

/**
 * 初始化专业排名视图表格
 * @return {[type]} [description]
 */
function initTable() {
	var major = getMajor();
	var $container = $("#exampleGrid");
	var $console = $("#exampleConsole");
	var $parent = $container.parent();
	var autosaveNotification;

	//专业信息
	var mj = [];
	mj.push("专业信息");
	for (var i = 0; i < major.length; i++) {
		mj.push(major[i].type);
	}

	//学校信息
	var scj = new Array();
	if (!schoolList || schoolList == "null") {
		schoolList = new Array();
	}
	$("#school1 li").each(function(e) {
		scj.push($(this).find(".schoolNameCh").html());

		schoolList.push({
			schoolNameCh: $(this).find(".schoolNameCh").html(),
			Major: major
		});
	});

	//console.log(schoolList);

	$container.handsontable({
		rows: scj.length,
		cols: mj.length,
		rowHeaders: scj,
		colHeaders: mj,
		minSpareCols: 1,
		minSpareRows: 1,
		fillHandle: true,
		//右键菜单   contextMenu: true,
	});

	$(".htRowHeader").attr("style", "min-width:155px;");

	//恢复获取专业数据排名样式事件
	$("#div_setTable").attr("style", "background-color:#43a0ff; width:130px;");
}

/**
 * 获取专业信息
 * @return {[type]} [description]
 */
function getMajor() {
	if (localStorage.scountry == "uk") {
		return ukrank;
	} else if (localStorage.scountry == "au") {
		return aurank;
	}
}

/**
 * 绑定表格中的专业信息
 * @return {[type]} [description]
 */
function bindTableMajor() {
	var major = getMajor();
	for (var i = 0; i < major.length; i++) {
		$("#th_major").append("<th>" + major[i].type + "</th>");
	}
}

/**
 * 查询
 * @return {[type]} [description]
 */
function search() {
	console.log(url);
	if ($("#major1").html() != "选择专业大类" && $("#major2").html() != "选择专业排名") {
		var entity = buildConditionEntity();
		console.log(entity);
		post(url, entity);
	} else {
		request(url);
	}
}

/**
 * 循环查询
 * @return {[type]} [description]
 */
function eachSearch() {
	localStorage.sTotalCount = 0;
	$(".schoolList li").remove();
	schoolList = null;

	var url = buildUrl();
	console.log(url);
	var type = "";
	var entity = {};
	if ($("#major1").html() != "选择专业大类" && $("#major2").html() != "选择专业排名") {
		entity = buildConditionEntity();
		type = 'POST';
	} else {
		type = "GET";
	}
	toAjax(url, type, entity, function(result) {
		if ($(".schoolList").length == 0) {
			tzMsg("信息抓取异常！");
			return;
		}
		//获取最大页码
		localStorage.sPageIndex = $(result).find("#next a").last().prev().html();
		if (!localStorage.sPageIndex || localStorage.sPageIndex == "null") {
			localStorage.sPageIndex = 1;
		}

		for (var i = 0; i < parseInt(localStorage.sPageIndex); i++) {
			localStorage.pageIndex = i + 1;
			url = buildUrl();
			ajax(url, type, entity)
		}
		initTable();
	});
}

/**
	GET http://www.51offer.com/school/uk-all-1.html?rankmajorsName=%E5%B7%A5%E7%A7%91&rankmajorName=%E8%88%AA%E7%A9%BA%E5%92%8C%E5%88%B6%E9%80%A0%E5%B7%A5%E7%A8%8B%E5%AD%A6
	Content-type: application/x-www-form-urlencoded
 *
 * 
 * @return {[type]}
 */
function request(url) {
	ajax(url, "GET");
}

function post(url, entity) {
	ajax(url, "POST", entity);
}

/**
 * ajax 请求方法
 * @param  {[type]} url  [description]
 * @param  {[type]} type [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function ajax(url, type, data) {
	$.ajax({
		url: url,
		type: type,
		data: data,
		timeout: 5000,
		async: false,
		error: function(ex) {
			tzMsg(ex.statusText);
		},
		success: function(result) {
			if ($(".schoolList").length == 0) {
				tzMsg("信息抓取异常！");
				return;
			}
			var list = $(result).find(".schoolList ul li");
			for (var i = 0; i < list.length; i++) {

				$('#ul_school').magicMove({
					easing: 'ease',
					duration: 300
				}, function() {
					var index = $(this).children().length + 1;
					var $el = list[i];
					$('#ul_school').before($el);
				});

				//$("#ul_school").append(list[i]);
				setLoadingMsg(1);
				$('.nationFlag').remove();
			}
		}
	});
}

/**
 * [toAjax description]
 * @param  {[type]} url     [description]
 * @param  {[type]} type    [description]
 * @param  {[type]} data    [description]
 * @param  {[type]} callbak [description]
 * @return {[type]}         [description]
 */
function toAjax(url, type, data, callbak) {
	// body...
	$.ajax({
		url: url,
		type: type,
		data: data,
		timeout: 5000,
		error: function(ex) {
			tzMsg(ex.statusText);
		},
		success: function(result) {
			callbak(result);
		}
	});
}

/**
 * [ajaxMajor description]
 * @param  {[type]} url    [description]
 * @param  {[type]} entity [description]
 * @return {[type]}        [description]
 */
function ajaxMajor(url, entity) {
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
			//获取所有页数
			var pageIndex = $(result).find("#next a").last().prev().html();
			if (!localStorage.sPageIndex || localStorage.sPageIndex == "null") {
				for (var i = 1; i < pageIndex; i++) {
					localStorage.pageIndex = i;
					var url = buildUrl();
					eachMajor(url, entity)
				}
			} else {
				localStorage.pageIndex = 1;
				var url = buildUrl();
				eachMajor(url, entity)
			}
		}
	});
}

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
				var g = $(list[i]).find(".allRank .rank").eq(0).html();
				//专业排名
				var m = $(list[i]).find(".pRank .rank").eq(0).html();


				for (var k = 0; k < schoolList.length; k++) {
					//根据名称判断是否对应学校
					if (schoolList[k].schoolNameCh == schoolNameCh) {
						for (var l = 0; l < schoolList[k].Major.length; l++) {
							if (schoolList[k].Major[l].direction == $("#major1").html() && schoolList[k].Major[l].type == $("#major2").html()) {
								schoolList[k].Major[l].grank = g;
								schoolList[k].Major[l].mrank = m;

								console.log("学校：" + schoolNameCh + "，专业：" + schoolList[k].Major[l].direction + " - " + schoolList[k].Major[l].type + " 综合排名：" + g + "  专业排名：" + m);
								break;
							}
						}
						console.log(schoolNameCh);
					}
				}
			}
		}
	});
}

/**
 * [setLoadingMsg description]
 * @param {[type]} count [description]
 */
function setLoadingMsg(count) {
	localStorage.sTotalCount++;
	$("#sc_msg").html("一共获取到" + localStorage.sPageIndex + "页数据，已获取到" + localStorage.sTotalCount + "条学校信息");
}

/**
 * 
 * http://www.51offer.com/school/uk-all-1.html?
 * rankmajorsName=
 * %E5%B7%A5%E7%A7%91
 * &rankmajorName=
 * %E8%88%AA%E7%A9%BA%E5%92%8C%E5%88%B6%E9%80%A0%E5%B7%A5%E7%A8%8B%E5%AD%A6

	http://www.51offer.com/school/uk-all-1.html?
	rankmajorsName=
	%E5%B7%A5%E7%A7%91&
	rankmajorName=
	%E8%88%AA%E7%A9%BA%E5%92%8C%E5%88%B6%E9%80%A0%E5%B7%A5%E7%A8%8B%E5%AD%A6&linestauts=2
 * @return {[type]} [description]
 */
function buildUrl() {
	var url = "http://www.51offer.com/school/{scountry}-{sarea}-{pageIndex}.html?&linestauts=2";
	url = url.replace('{scountry}', localStorage.scountry);
	url = url.replace('{sarea}', localStorage.sarea);
	url = url.replace('{pageIndex}', localStorage.pageIndex);
	return url;
}

/**
 * 生成条件对象
 * @return {[type]} [description]
 */
function buildConditionEntity() {
	var rankmajorsName = "";
	var rankmajorName = "";
	if ($("#major1").html() != "选择专业大类") {
		rankmajorsName = $("#major1").html();
	}
	if ($("#major2").html() != "选择专业排名") {
		rankmajorName = $("#major2").html();
	}

	var entity = {
		rankmajorsName: rankmajorsName,
		rankmajorName: rankmajorName
	};
	return entity;
}

/**
 * 通宵消息
 * @param  {[type]} body [description]
 * @return {[type]}      [description]
 */
function tzMsg(body) {
	try {
		//新方法
		var notification = new Notification("51School提醒", {
			body: body,
			icon: 'http://images.cnblogs.com/cnblogs_com/flyingzl/268702/r_1.jpg',
			tag: {}, // 可以加一个tag
		});
		notification.show();
	} catch (ex) {
		console.log(ex);
	}
}

/****-------- 专业相关 -------------****>
/**
 * 获取专业数据
 * @param  {[type]} 当前国家 [description]
 * @return {[type]}          [description]
 */
function loadRank(scountry) {
	$("#major1").html("选择专业大类");
	$("#sel_content").hide();
	$("#major2").html("选择专业排名");
	$("#sel_content1").hide();
	$(".searchContent").show();
	if (localStorage.scountry == "uk") {
		bindRank(ukrank);
	} else if (localStorage.scountry == "au") {
		bindRank(aurank);
	} else {
		$(".searchContent").hide();
	}
}

/**
 * 绑定专业大类数据
 * @param  {[type]} list [description]
 * @return {[type]}      [description]
 */
function bindRank(list) {
	$("#sel_content").html("");
	//查找出所有一级专业
	var a = new Array();
	for (var i = 0; i < list.length; i++) {
		if (existsDirection(a, list[i].direction)) {
			a.push({
				direction: list[i].direction
			});
		}
	};

	for (var i = 0; i < a.length; i++) {
		$("#sel_content").append("<div>" + a[i].direction + "</div>");
	}

	$("#sel_content div").click(function() {
		var direction = $(this).html();
		$("#major1").html(direction);
		$("#major2").html("请选择专业排名");
		$(this).parent().hide();
		if (localStorage.scountry == "uk") {
			bindRankByType(ukrank, direction);
		} else if (localStorage.scountry == "au") {
			bindRankByType(aurank, direction);
		}
	});
}

/**
 * 添加专业大类是判断是否存在
 * @param  {[type]} list      [description]
 * @param  {[type]} direction [description]
 * @return {[type]}           [description]
 */
function existsDirection(list, direction) {
	for (var i = 0; i < list.length; i++) {
		if (list[i].direction == direction) {
			return false;
		}
	}
	return true;
}

/**
 * 绑定专业小类
 * @param  {[type]} list      [description]
 * @param  {[type]} direction [description]
 * @return {[type]}           [description]
 */
function bindRankByType(list, direction) {
	$("#sel_content1").html("");
	//查找出所有二级专业
	var a = new Array();
	for (var i = 0; i < list.length; i++) {
		if (list[i].direction == direction) {
			a.push(list[i])
		}
	}
	for (var i = 0; i < a.length; i++) {
		$("#sel_content1").append("<div data-id=\"" + a[i].id + "\">" + a[i].type + "</div>");
	}
	$("#sel_content1 div").click(function() {
		$("#major2").html($(this).html());
		$(this).parent().hide();
	});
}


/**
 * 这里开始时UrlEncode和UrlDecode函数
 * @param {[type]} str [description]
 */
<!-- Begin    
function Encrypt(str, pwd) {
	if (str == "") return "";
	str = escape(str);
	if (!pwd || pwd == "") {
		var pwd = "1234";
	}
	pwd = escape(pwd);
	if (pwd == null || pwd.length <= 0) {
		alert("Please enter a password with which to encrypt the message.");
		return null;
	}
	var prand = "";
	for (var I = 0; I < pwd.length; I++) {
		prand += pwd.charCodeAt(I).toString();
	}
	var sPos = Math.floor(prand.length / 5);
	var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
	var incr = Math.ceil(pwd.length / 2);
	var modu = Math.pow(2, 31) - 1;
	if (mult < 2) {
		alert("Algorithm cannot find a suitable hash. Please choose a different password. /nPossible considerations are to choose a more complex or longer password.");
		return null;
	}
	var salt = Math.round(Math.random() * 1000000000) % 100000000;
	prand += salt;
	while (prand.length > 10) {
		prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
	}
	prand = (mult * prand + incr) % modu;
	var enc_chr = "";
	var enc_str = "";
	for (var I = 0; I < str.length; I++) {
		enc_chr = parseInt(str.charCodeAt(I) ^ Math.floor((prand / modu) * 255));
		if (enc_chr < 16) {
			enc_str += "0" + enc_chr.toString(16);
		} else
			enc_str += enc_chr.toString(16);
		prand = (mult * prand + incr) % modu;
	}
	salt = salt.toString(16);
	while (salt.length < 8) salt = "0" + salt;
	enc_str += salt;
	return enc_str;
}

function Decrypt(str, pwd) {
		if (str == "") return "";
		if (!pwd || pwd == "") {
			var pwd = "1234";
		}
		pwd = escape(pwd);
		if (str == null || str.length < 8) {
			alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
			return;
		}
		if (pwd == null || pwd.length <= 0) {
			alert("Please enter a password with which to decrypt the message.");
			return;
		}
		var prand = "";
		for (var I = 0; I < pwd.length; I++) {
			prand += pwd.charCodeAt(I).toString();
		}
		var sPos = Math.floor(prand.length / 5);
		var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
		var incr = Math.round(pwd.length / 2);
		var modu = Math.pow(2, 31) - 1;
		var salt = parseInt(str.substring(str.length - 8, str.length), 16);
		str = str.substring(0, str.length - 8);
		prand += salt;
		while (prand.length > 10) {
			prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
		}
		prand = (mult * prand + incr) % modu;
		var enc_chr = "";
		var enc_str = "";
		for (var I = 0; I < str.length; I += 2) {
			enc_chr = parseInt(parseInt(str.substring(I, I + 2), 16) ^ Math.floor((prand / modu) * 255));
			enc_str += String.fromCharCode(enc_chr);
			prand = (mult * prand + incr) % modu;
		}
		return unescape(enc_str);
	}
	//  End -->