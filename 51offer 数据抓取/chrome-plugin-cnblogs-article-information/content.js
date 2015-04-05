var postInfo = $(".schoolLabel");
if(postInfo.length==0){
	chrome.runtime.sendMessage({type:"article-information", error:"获取学校信息失败."});
}
else{
	var msg = {
		type: "article-information",
		title : "学校广场",
		//postDate : postInfo.find("#post-date").text(),
		//author : postInfo.find("a").first().text(),
		url: document.URL
	};
	chrome.runtime.sendMessage(msg);
}
