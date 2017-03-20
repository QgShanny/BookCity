define(['jquery', 'localStorage'], function() {

	var jsonStr, boyJson; //书籍的json数据
	var booksArr = [];

	//书籍分类，男生，女生，科技。。。
	var boyArr = [];
	var girlArr = [];
	//书籍的根地址
	var ref = new Wilddog("https://bookcity2017.wilddogio.com/Books");

	//once 只读取一次
	ref.once("value", function(snapshot) {
		var jsonStr = snapshot.val();
		for(i in jsonStr) {
			booksArr.push(jsonStr[i]);
		}

//		for(var i = 0; i = booksArr.length; i++) {
//			var bookList = "<tr>1<td></td<td></td><td></td><td></td></tr>";
//			$(bookList).appendTo($(".backManager"));
//		}
		
		for(i in booksArr) {
			//男频推荐内容类别
			if(booksArr[i].Class == "男生") {
				boyArr.push(booksArr[i]);
			}
			if(booksArr[i].Class == "女生") {
				girlArr.push(booksArr[i]);
			}
		}

		//把男生书本插入列表里面
		for(i in boyArr) {
			var li = "<li class='mui-table-view-cell'><a class='mui-navigate-right'>" + boyArr[i].BookName + "</a></li>";
			$("<li class='mui-table-view-cell'><a class='mui-navigate-right'>" + boyArr[i].BookName + "</a></li>").appendTo($("#boyTui ul:nth-of-type(2)"));
		}
		//把女生书本插入列表里面
		for(i in girlArr) {
			var li = "<li class='mui-table-view-cell'><a class='mui-navigate-right'>" + girlArr[i].BookName + "</a></li>";
			$("<li class='mui-table-view-cell'><a class='mui-navigate-right'>" + girlArr[i].BookName + "</a></li>").appendTo($("#girlTui ul:nth-of-type(2)"));
		}

		//			for(i in boyArr) {
		//				if(i == (boyArr.length - 1)) {
		//					boyJson += '{"BookName":"' + boyArr[i].BookName + '"}';
		//				} else {
		//					boyJson += '{"BookName":"' + boyArr[i].BookName + '"},';
		//				}
		//			}
		//
		//			boyJson = "[" + boyJson + "]";
		//			console.log(boyJson);
		//			boyJson = JSON.parse(boyJson);

	});

	var jsonUserStr; //之后要优化
	var usersArr = [];
	var ref = new Wilddog("https://bookcity2017.wilddogio.com/Users");
	//on 有变化就读取
	ref.on("value", function(snapshot) {
		var jsonUserStr = snapshot.val();
		for(i in jsonUserStr) {
			usersArr.push(jsonUserStr[i]);
		}
	});

	//判断用户是否登录,或登录是否还有效
	var obj = localStorage.getItem("userId");
	if(obj == null) {
		$("#username").text("点击登录");
	} else {
		var msg = getStorage("userId", 1000 * 6);
		if(msg == 0) {
			$("#username").text("点击登录");
			return;
		}
		var username = getStorageNow("userName");
		$("#username").text(username);
		//登录后显示积分到侧边栏
		var scoreObj = getStorageNow("score");
		$("#score").text(scoreObj);
	}

	//签到
	$("#sign").on('tap', function() {
		var userObj = getStorageNow("userId");
		if(userObj == null) {
			var btnArray = ['取消', '确认'];
			mui.confirm("您未登录,是否登录？", "", btnArray, function(e) {
				//回调方法内容
				if(e.index == 1) {
					window.location.href = "login.html";
				}
			});
		} else {
			mui.alert("签到成功", function() {
				//更新积分
				var ref = new Wilddog("https://bookcity2017.wilddogio.com/Users"); //找到对应的用户
				var newRef = ref.child("-Ke9Vh_OrBIKqbBQt2qg");
				scoreObj = parseInt(scoreObj) + 10;
				newRef.update({
					"Score": scoreObj
				});
				$("#score").text(scoreObj);
				setStorage("score", scoreObj);
			});
		}
	});

})