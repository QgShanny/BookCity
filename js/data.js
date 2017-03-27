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
			booksArr.push(jsonStr[i]);
		}

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
			var li = "<li class='mui-table-view-cell'><a class='mui-navigate-right'>" + boyArr[i].bookName + "</a></li>";
			$("<li class='mui-table-view-cell'><a class='mui-navigate-right'>" + boyArr[i].bookName + "</a></li>").appendTo($("#boyTui ul:nth-of-type(2)"));
		}
		//把女生书本插入列表里面
		for(i in girlArr) {
			var li = "<li class='mui-table-view-cell'><a class='mui-navigate-right'>" + girlArr[i].bookName + "</a></li>";
			$("<li class='mui-table-view-cell'><a class='mui-navigate-right'>" + girlArr[i].bookName + "</a></li>").appendTo($("#girlTui ul:nth-of-type(2)"));
		}
		
//		$(function(){
		for(var i = 0;i<girlArr.length;i++){
			console.log(i);
			var p = i + 1;
			(function(){
				$(document).on('tap','#girlTui ul:nth-of-type(2) li:nth-last-of-type('+p+')',function(){
					console.log(p);
					setStorage('imgUrl',girlArr[p-1].imgUrl);
					setStorage('bookName',girlArr[p-1].bookName);
					setStorage('author',girlArr[p-1].author);
					setStorage('classIs',girlArr[p-1].Class);
					setStorage('from',girlArr[p-1].from);
					setStorage('msg',girlArr[p-1].msg);
					setStorage('key',girlArr[p-1].key);
					window.location.href = "bookDetail.html";
				});
			})()
		}
//	})
	});

	

	
	
	function getBookMsg(url,bookname,author,classis,from,msg){
		$("#bookImg").attr("src",url);
		$(".bookName").text(bookname);
		$("#author").text(author);
		$("#from").text(from);
		$("#classIs").text(classis);
		$(".bookIntroduce").text(msg);
	}
				
	function addLi(snap) {
		var li = "<li class='mui-table-view-cell'><a class='mui-navigate-right'>" + snap.val().BookName + "</a></li>";
		return li;
	}
	var jsonUserStr; //之后要优化
	var usersArr = [];
	var refUser = new Wilddog("https://bookcity2017.wilddogio.com/Users");
	//on 有变化就读取
	refUser.on("value", function(snapshot) {
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
	window.getBookMsg = getBookMsg;
})