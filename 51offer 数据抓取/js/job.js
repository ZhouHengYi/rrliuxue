
onmessage = function(evt) {
	//do massive job.在这里你进行大量耗时的计算过程。
	//循环所有该国家专业信息
	//每个专业进行全部数据匹配
	//所有学校所有专业匹配
	//访问51offer进行查询记录结果
	//比较耗时，操蛋
	//

	data = {
		rankmajorsName : "",
		rankmajorName : "",
		type:'UpdateMajorHtml'
	}

	//http://www.51offer.com/school/uk-all-1.html?rankmajorsName=%E5%B7%A5%E7%A7%91&rankmajorName=%E8%88%AA%E7%A9%BA%E5%92%8C%E5%88%B6%E9%80%A0%E5%B7%A5%E7%A8%8B%E5%AD%A6
	for (var i = 0; i < evt.data.major.length; i++) {
		data.rankmajorsName = evt.data.major[i].direction;
		data.rankmajorName = evt.data.major[i].type;

		//更新专业选项卡
		postMessage(data);

		var url = buildUrl(evt.data.scountry,evt.data.sarea,1);
		console.log(url);
		var entity = {
			rankmajorsName: data.rankmajorsName,
			rankmajorName: data.rankmajorName
		};

		data.url = url;
		data.entity = entity;
		data.type = "ajaxMajor";
		postMessage(data);
		//ajaxMajor(url, entity);
	}
	//postMessage(data); //将计算结果的数据发送会主线程
}

function buildUrl(scountry,sarea,pageIndex) {
	var url = "http://www.51offer.com/school/{scountry}-{sarea}-{pageIndex}.html?&linestauts=2";
	url = url.replace('{scountry}', scountry);
	url = url.replace('{sarea}', sarea);
	url = url.replace('{pageIndex}', pageIndex);
	return url;
}