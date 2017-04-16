define(['jquery', 'localStorage'], function() {	
	var btnArray = ['取消', '确认'];
	var refUserBooks = new Wilddog("https://bookcity2017.wilddogio.com/users/" + getStorageNow("userKey") + "/buyBooks");
	refUserBooks.on('value', function(snap) {
		var jsonBooks = snap.val();
		if(jsonBooks != null) {
			var count = 0;
			for(i in jsonBooks) {
				count++;
				var ref = new Wilddog("https://bookcity2017.wilddogio.com/books/" + jsonBooks[i].buy);
				ref.once('value', function(snap) {
					var jsonstr = snap.val();
					$('<li key="' + jsonBooks[i].buy + '"><img src="' + jsonstr.imgUrl + '"/></li>').appendTo($("#bookShelf ul"));
					if(count % 4 == 0) {
						$('<span class="ulBottom"></span>').appendTo($("#bookShelf ul"));
					}
				});
			}
			if(count % 4 != 0)
				$('<span class="ulBottom"></span>').appendTo($("#bookShelf ul"));
			$("#bookShelf").css("display", "black");
		} else {
			$("#nothing").css("display", "block");
		}
	});
	$(document).on('tap', '#bookShelf ul li', function() {
		var bookKey = $(this).attr("key");
		setStorage("bookKey", bookKey);
		window.location.href = 'bookDetail.html';
	});

	var jsonStr, boyJson, bookList; //书籍的json数据
	var booksArr = [];

	//书籍分类，男生，女生，科技。。。
	var boyLen = 0;
	var girlLen = 0;
	//书籍的根地址
	var ref = new Wilddog("https://bookcity2017.wilddogio.com/books");
	//once 只读取一次
	ref.on("value", function(snapshot) {
		jsonStr = snapshot.val();
		for(i in jsonStr) {
			$('<li style="display:none;" key=' + i + '>' + jsonStr[i].bookName + ' ' + jsonStr[i].author + '</li>').appendTo($("#searchResult"));
			if(jsonStr[i].Class == "男生") {
				$("<li key=" + i + " class='mui-table-view-cell'><a class='mui-navigate-right'>" + jsonStr[i].bookName + "</a></li>").appendTo($("#boyTui ul:nth-of-type(2)"));
				boyLen++;
			}
			if(jsonStr[i].Class == "女生") {
				$("<li key=" + i + " class='mui-table-view-cell'><a class='mui-navigate-right'>" + jsonStr[i].bookName + "</a></li>").appendTo($("#girlTui ul:nth-of-type(2)"));
				girlLen++;
			}
			console.log("书籍插入完毕。")
		}

		//男生分区点击书籍进入书籍详情
		for(var i = 0; i < boyLen; i++) {
			(function() {
				var p = i + 1;
				$(document).on('tap', '#boyTui ul:nth-of-type(2) li:nth-of-type(' + p + ')', function() {
					setStorage('bookKey', $(this).attr("key"));
					setStorage("bookType", "book");
					window.location.href = "bookDetail.html";
				});
			})()
		}
		//女生分区点击书籍进入书籍详情
		for(var i = 0; i < girlLen; i++) {
			(function() {
				var p = i + 1;
				$(document).on('tap', '#girlTui ul:nth-of-type(2) li:nth-of-type(' + p + ')', function() {
					setStorage('bookKey', $(this).attr("key"));
					setStorage("bookType", "book");
					window.location.href = "bookDetail.html";
				});
			})()
		}

	});

	//商家区域的信息显示
	var refCollect = new Wilddog("https://bookcity2017.wilddogio.com/users/" + getStorageNow('userKey') + "/collectionStore");
	var collectStore = [];
	var collectStoreKey = [];
	refCollect.on('value', function(snap) {
		var rst = snap.val();
		for(i in rst){
			collectStore.push(rst[i].storeKey);
			collectStoreKey.push(i);
		}
	});
	var jsonStr;
	var store = "";
	var ref = new Wilddog("https://bookcity2017.wilddogio.com/users");
	//on 有变化就读取
	ref.on("value", function(snapshot) {
		$(".store").remove();
		var jsonStr = snapshot.val();
		for(i in jsonStr) {
			if(jsonStr[i].sureSeller == 1) {
				if(jsonStr[i].userHead != null) {
					var userHead = jsonStr[i].userHead;
				} else {
					var userHead = "../img/logo.png";
				}
				var temp = collectStore.indexOf(i);
				var heart = 'icon-heart';
				if(temp!=-1){
					heart = 'icon-aixin';
					var key = collectStoreKey[temp];
				}
				else{
					heart = 'icon-heart';
					var key = "";
				}
				store = '<div class="store" storeID = ' + i + '>' +
					'<img class="storeImg" src="' + userHead + '"/><h5>' + jsonStr[i].storeName +
					'</h5><p>' + jsonStr[i].explain + '</p><i key = "'+key+'" class="collectStore iconfont ' + heart + '" style="font-size:27px;"></i>' +
					'</div><div class="clearfix"></div>';
				$(store).appendTo($("#showSale"));
			}
		}
	});



	//	判断用户是否登录,或登录是否还有效
	var obj = getStorageNow("userKey");
	if(obj == null) {
		$("#username").text("点击登录");
	} else {
		var msg = getStorage("userKey", 1000 * 60 * 60 * 2);
		if(msg == 0) {
			$("#username").text("点击登录");
			return;
		}
		//侧边栏要根据登录的用户去显示用户名，积分，阅读数	
		if(getStorageNow("userHead") != null)
			$("#userHead img").attr("src", getStorageNow("userHead"));
		if(getStorageNow("readNum") != null)
			$("#readNum").text(getStorageNow("readNum"));
		$("#username").text(getStorageNow("userName"));
		$("#score").text(getStorageNow("score"));
		console.log("用户信息显示完毕");
	}

	//	签到
	$("#sign").on('tap', function() {
		var signFlag = sign("userKey");
		if(signFlag == 1) {
			mui.alert("签到成功,增加10个积分", function() {
				//更新积分
				var key = getStorageNow("userKey");
				var ref = new Wilddog("https://bookcity2017.wilddogio.com/users"); //找到对应的用户
				var newRef = ref.child(key);
				var scoreObj = parseInt(getStorageNow("score")) + 10;
				newRef.update({
					"score": scoreObj
				});
				$("#score").text(scoreObj);
				setStorage("score", scoreObj);
			});
		}
	});

	//	登录界面
	var loginFun = function() {
			var btnArray = ['取消', '确认'];
			mui.confirm("您未登录,是否登录？", "", btnArray, function(e) {
				//回调方法内容
				if(e.index == 1) {
					window.location.href = "login.html";
				}
			});
		}
		//	判断登录是否有效
	var sign = function(key) {
			var signFlag = 0;
			var data = getStorageNow(key);
			if(data == null) {
				loginFun();
				return;
			} else {
				var msg = getStorage(key, 1000 * 60 * 60 * 2);
				if(msg == 0) {
					loginFun();
					return;
				}
			}
			signFlag = 1;
			return signFlag;
		}
		// 积分更新
	var updateScore = function(scoreTemp, type) {
		//更新积分
		var key = getStorageNow("userKey");
		var ref = new Wilddog("https://bookcity2017.wilddogio.com/users"); //找到对应的用户
		var newRef = ref.child(key);
		if(type == 1) {
			var scoreObj = parseInt(getStorageNow("score")) + scoreTemp;
		} else {
			var scoreNow = getStorageNow("score");
			if(scoreNow < scoreTemp) {
				mui.alert("您的积分不够，可通过签到，反馈意见，收藏等获取积分！");
				return 0;
			}
			var scoreObj = parseInt(getStorageNow("score")) - scoreTemp;
		}
		newRef.update({
			"score": scoreObj
		});
		$("#score").text(scoreObj);
		setStorage("score", scoreObj);
		return 1;
	}

	window.loginFun = loginFun;
	window.sign = sign;
	window.updateScore = updateScore;
})