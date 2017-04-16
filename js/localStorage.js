define(['jquery'], function() {

	function setStorage(key, value) {
		var setTime = new Date().getTime();
		localStorage.setItem(key, JSON.stringify({
			data: value,
			time: setTime
		}));
	}

	function getStorage(key, exp) {
		var data = localStorage.getItem(key);
		data = JSON.parse(data);
		var msg = 0;

		if(new Date().getTime() - data.time > exp) {
			localStorage.removeItem(key);
			console.log("没有用户登录");
			msg = 0;
		} else {
			msg = 1;
			console.log("已有用户登录");
		}

		return msg;
	}
	
	function getStorageNow(key){
		var data = localStorage.getItem(key);
		if(data == null){
			return;
		}
		data = JSON.parse(data);
		data = data.data;
		return data;
	}
	
	function removeItems(A){
		for(var i = 0;i<A.length;i++){
			localStorage.removeItem(A[i]);
		}
	}

	window.setStorage = setStorage;
	window.getStorage = getStorage;
	window.getStorageNow = getStorageNow;
	window.removeItems = removeItems;
})