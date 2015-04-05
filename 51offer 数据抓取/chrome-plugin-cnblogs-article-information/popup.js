/**
 * 添加页面内容加载完成事件
 * @param  {[type]} ) {	console.log('popup.js')	var data [description]
 * @return {[type]}   [description]
 */
 document.addEventListener('DOMContentLoaded', function () {
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
 	sglobalrank:'',
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
 * 综合排名
 * @type {String}
 localStorage.sglobalrank = '';
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
 $(function(){
 	if(localStorage.scountry && localStorage.scountry.length == 0)
 	{
 		localStorage.scountry = $("#scountry .active").attr("id");
 	}

 	loadRank(localStorage.scountry);
 	init();
 	bindEvent();
});

/**
 * [init description]
 * @return {[type]} [description]
 */
function init(){
	//初始化国家
	$("#scountry a").removeClass("active");
	$("#"+localStorage.scountry).addClass("active");

	//初始化学校名称
	if(localStorage.cname)
	{
		$("#cname").val(localStorage.cname)
	}

	//初始化所选地区
	$("[data-id='"+localStorage.scountry+"']").show();
	$("[data-id='"+localStorage.scountry+"'] a").removeClass("active");
	$("[data-id='"+localStorage.scountry+"']").find("[data-area='"+localStorage.sarea+"']").addClass("active");

	//初始化综合排名
	$("#sglobalrank").removeClass("active");
	$("#sglobalrank").find("[data-globalRank='"+localStorage.globalRank+"']").addClass("active");
}

/**
 * 绑定事件
 * @return {[type]} [description]
 */
function bindEvent(){
 	/**
 	 * 专业排名事件处理
 	 * @param  {[type]} ){ 		$(this).next().show(); 	} [description]
 	 * @return {[type]}     [description]
 	 */
 	$(".tab_sel").click(function(){
 		$(this).next().show();
 	});
	//国家切换事件
	$("#scountry a").click(function(){
		localStorage.scountry = $(this).attr("id");
		$("#scountry a").removeClass("active");
		$(this).addClass("active");
		$("[name='sarea']").hide();
		$("[data-id='"+localStorage.scountry+"']").show();
		loadRank(localStorage.scountry);
	});

	//地区数据展示
	$("[name='sarea'] a").click(function(){
		$(this).parent().find("a").removeClass("active");
		$(this).addClass("active");
		localStorage.sarea = $(this).attr("data-area");
	});

	//综合排名
	$("#sglobalrank a").click(function(){
		$("#sglobalrank a").removeClass("active");
		$(this).addClass("active");
		localStorage.sglobalrank = $(this).attr("data-globalRank");
	});

	//隐藏查询条件
	$("#div_slide").click(function(){
		var el = $("#div_conditions");
		if ($(this).hasClass("slideUp")) {
			$(this).removeClass("slideUp").addClass("slideDown");
			el.slideUp(200);
		} else {
			$(this).removeClass("slideDown").addClass("slideUp");
			el.slideDown(200); }
		});

	$("#div_search").click(function(){
		getData();
	});
}


function getData(){
	$.ajax({
            url: 'http://www.51offer.com/school/uk-all-1.html',
            type: 'GET',
            dataType: 'html',
            timeout: 1000,
            error: function(ex){
                console.log('Error loading PHP document');
            },
            success: function(result){
                console.log(result);
                if($(".schoolList").length == 0)
                {
                	tzMsg("信息抓取异常！");
                	return;
                }
                
                $("#ul_school").html($(result).find(".schoolList ul").html());
                $("#ul_school .nationFlag").remove();
            }
    });
}

function tzMsg(body){
    try{
        //新方法
        var notification = new Notification("51School提醒",{
            body : body,
            icon : 'http://images.cnblogs.com/cnblogs_com/flyingzl/268702/r_1.jpg',
            tag : {}, // 可以加一个tag
        });
        notification.show();
    }catch(ex){
        console.log(ex);
    }
}

/****-------- 专业相关 -------------****>
/**
 * 获取专业数据
 * @param  {[type]} 当前国家 [description]
 * @return {[type]}          [description]
 */
 function loadRank(scountry){
 	$("#major1").html("选择专业大类");
 	$("#sel_content").hide();
 	$("#major2").html("选择专业排名");
 	$("#sel_content1").hide();
 	$(".searchContent").show();
 	if(localStorage.scountry == "uk"){
 		bindRank(ukrank);
 	}else if(localStorage.scountry=="au"){
 		bindRank(aurank);
 	}else{
 		$(".searchContent").hide();
 	}
 }

/**
 * 绑定专业大类数据
 * @param  {[type]} list [description]
 * @return {[type]}      [description]
 */
 function bindRank(list){
 	$("#sel_content").html("");
	//查找出所有一级专业
	var a = new Array();
	for (var i = 0 ; i< list.length;i ++) {
		if(existsDirection(a,list[i].direction)){
			a.push({direction:list[i].direction});
		}
	};

	for(var i = 0 ; i < a.length ; i ++)
	{
		$("#sel_content").append("<div>"+a[i].direction+"</div>");
	}

	$("#sel_content div").click(function(){
		var direction = $(this).html();
		$("#major1").html(direction);
		$("#major2").html("请选择专业排名");
		$(this).parent().hide();
		if(localStorage.scountry == "uk"){
			bindRankByType(ukrank,direction);
		}else if(localStorage.scountry=="au"){
			bindRankByType(aurank,direction);
		}
	});
}

/**
 * 添加专业大类是判断是否存在
 * @param  {[type]} list      [description]
 * @param  {[type]} direction [description]
 * @return {[type]}           [description]
 */
 function existsDirection(list,direction){
 	for(var i = 0 ; i < list.length ; i ++)
 	{
 		if(list[i].direction == direction)
 		{
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
 function bindRankByType(list,direction){
 	$("#sel_content1").html("");
	//查找出所有二级专业
	var a = new Array();
	for (var i = 0 ; i< list.length;i ++) {
		if(list[i].direction == direction)
		{
			a.push(list[i])
		}
	}
	for(var i = 0 ; i < a.length ; i ++)
	{
		$("#sel_content1").append("<div data-id=\""+a[i].id+"\">"+a[i].type+"</div>");
	}
	$("#sel_content1 div").click(function(){
		$("#major2").html($(this).html());
		$(this).parent().hide();
	});
};