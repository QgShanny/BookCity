define(['jquery', 'localStorage'], function() {
	var jsonStr, boyJson, bookList; //书籍的json数据
	var booksArr = [];

	//书籍分类，男生，女生，科技。。。
	var boyArr = [];
	var girlArr = [];
	//书籍的根地址
	var ref = new Wilddog("https://bookcity2017.wilddogio.com/books");

	//once 只读取一次
	ref.on("value", function(snapshot) {
		jsonStr = snapshot.val();
		for(i in jsonStr) {
			if(jsonStr[i].Class == "男生"){	
				$("<li class='mui-table-view-cell'><a class='mui-navigate-right'>" + jsonStr[i].bookName + "</a></li>").appendTo($("#boyTui ul:nth-of-type(2)"));
			}
			if(jsonStr[i].Class == "女生"){		
				$("<li key="+i+" class='mui-table-view-cell'><a class='mui-navigate-right'>" + jsonStr[i].bookName + "</a></li>").appendTo($("#girlTui ul:nth-of-type(2)"));		
			}
		}

		
		//女生分区点击书籍进入书籍详情
		for(var i = 0; i < 2; i++) {
			(function() {
				var p = i + 1;
				$(document).on('tap', '#girlTui ul:nth-of-type(2) li:nth-of-type(' + p + ')', function() {
					setStorage('bookKey', $(this).attr("key"));
					window.location.href = "bookDetail.html";
				});
			})()
		}

	});

	function addLi(snap) {
		var li = "<li class='mui-table-view-cell'><a class='mui-navigate-right'>" + snap.val().BookName + "</a></li>";
		return li;
	}

	var jsonStr; //用户的json数据
	var usersArr = [];
	storesArr = [];
	var store = "";
	var ref = new Wilddog("https://bookcity2017.wilddogio.com/users");
	//on 有变化就读取
	ref.once("value", function(snapshot) {
		$(".store").remove();
		var jsonStr = snapshot.val();
		for(i in jsonStr) {
			if(jsonStr[i].sureSeller == 1){
				store += '<div class="store" storeID = '+jsonStr[i].key + '>'
						+ '<img class="storeImg" src="../img/index1.jpg"/><h5>' + jsonStr[i].storeName 
						+ '</h5><p>'+jsonStr[i].explain+'</p><i class="mui-icon mui-icon-search collectStore"></i>' 
						+ '</div><div class="clearfix"></div>';
			}
			$("#showSale").html(store);
		}
	});
	
	//	收藏店家
	$(document).on('tap', '.collectStore', function() {
		var key = $(this).parent().attr("storeID");
		ref = new Wilddog("https://bookcity2017.wilddogio.com/users/"+getStorageNow("userKey")+"/collectionStore");
		var newref = ref.push({
			storeKey:key
		});
		mui.alert("收藏成功");
	})

	//判断用户是否登录,或登录是否还有效
	var obj = localStorage.getItem("userId");
	if(obj == null) {
		$("#username").text("点击登录");
	} else {
		var msg = getStorage("userId", 1000 * 60 * 60 * 2);
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
		var signFlag = sign("userId");
		if(signFlag == 1) {
			mui.alert("签到成功", function() {
				//更新积分
				var key = getStorageNow("userKey");
				var ref = new Wilddog("https://bookcity2017.wilddogio.com/users"); //找到对应的用户
				var newRef = ref.child(key);
				scoreObj = parseInt(scoreObj) + 10;
				newRef.update({
					"Score": scoreObj
				});
				$("#score").text(scoreObj);
				setStorage("score", scoreObj);
			});
		}
	});

	var loginFun = function() {
		var btnArray = ['取消', '确认'];
		mui.confirm("您未登录,是否登录？", "", btnArray, function(e) {
			//回调方法内容
			if(e.index == 1) {
				window.location.href = "login.html";
			}
		});
	}
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

	$("#submitSuggest").on('tap', function() {
		var flag = sign("userId");
		console.log(flag);
		if(flag == 1) {
			var btnArray = ['取消', '确定'];
			mui.prompt('请输入您对本移动书城的评语：', '', '', btnArray, function(e) {
				if(e.index == 1) {
					var now = new Date();

					var year = now.getFullYear(); //年  
					var month = now.getMonth() + 1; //月  
					var day = now.getDate(); //日  

					var hh = now.getHours(); //时  
					var mm = now.getMinutes(); //分  
					var ss = now.getSeconds(); //秒  
					console.log(e.value);
					var ref = new Wilddog("https://bookcity2017.wilddogio.com/suggests");
					var newRef = ref.push({
						"userName": getStorageNow('userName'),
						"content": e.value,
						"time": year + "/" + month + "/" + day + " " + hh + ":" + mm + ":" + ss
					});
					var postID = newRef.key();
					var ref = new Wilddog("https://bookcity2017.wilddogio.com/suggests/" + postID);
					ref.update({
						"key": postID
					});
				}
			});

		}
	});


	window.loginFun = loginFun;
	window.sign = sign;
})