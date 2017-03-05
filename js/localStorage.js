function setStorage(key, value) {
	var setTime = new Date().getTime();
	localStorage.setItem(key, JSON.stringify({
		data: value,
		time: setTime
	}));
	console.log(localStorage.getItem(key));
	//	setTimeout(function() {
	//		localStorage.removeItem(key);
	//		console.log("退出");
	//	}, 1000 * 60 * 60 * 2);	//两个小时后自动清除缓存
}

function getStorage(key, exp) {
	var data = localStorage.getItem(key);
	data = JSON.parse(data);
	var msg = "";

	if(new Date().getTime() - data.time > exp) {
		console.log("out");
		msg = "0";
	} else {
		msg = "1";
		console.log("in");
	}

	return msg;
}