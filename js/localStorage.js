function setStorage(key, value) {
	var setTime = new Date().getTime();
	localStorage.setItem(key, JSON.stringify({
		data: value,
		time: setTime
	}));
	console.log(localStorage.getItem(key));
	setTimeout(function() {
		localStorage.removeItem(key);
	}, 1000 * 60 * 60 *2);	//两个小时后自动清除缓存
}

function getStorage(key) {
	var data = localStorage.getItem(key);
	if(data == null) {
		console.log("out");
	} else {
		var obj = JSON.parse(data);
		console.log("in");
		console.log(obj.data);
	}
}