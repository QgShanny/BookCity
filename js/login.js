require.config({
	paths: {
		"jquery": "lib/jquery-1.9.1",
		"mui": "lib/mui.min",
		"localStorage": "localStorage"
	},
	shim: {
		//no
	}

});
define(['jquery', 'mui', 'localStorage'], function() {

	var jsonStr; //用户的json数据
	var ref = new Wilddog("https://bookcity2017.wilddogio.com/users");
	//on 有变化就读取
//	$("#login").on('tap', function() {
//		var phone = $.trim($("#phone").val());
//		var password = $.trim($("#password").val());
//		if(phone.length == 0 || password.length == 0) {
//			mui.alert("请输入正确的用户名和密码");
//			return;
//		}
//		console.log("开始比对数据");
//		ref.on("value", function(snapshot) {
//			jsonStr = snapshot.val();
//			console.log("用户信息爬取完成");
//		});
//	});
	
	ref.on("value", function(snapshot) {
		jsonStr = snapshot.val();
		console.log("用户信息爬取完成");
		$("#login").on('tap', function() {
			var phone = $.trim($("#phone").val());
			var password = $.trim($("#password").val());
			if(phone.length == 0 || password.length == 0) {
				mui.alert("请输入正确的用户名和密码");
				return;
			}
			var status = 0;
			for(i in jsonStr) {
				if(phone == jsonStr[i].phone && password == jsonStr[i].password) {
					mui.alert(jsonStr[i].userName + " 登录成功", function() {
						window.location.href = "index.html";
					});
					status = 1;
					setStorage("userKey", i);
					console.log("用户" + i + "登录成功");
					var imgdata = jsonStr[i].userHead;
					if(ImageData != null) {
						setStorage("userHead", imgdata);
					}
					setStorage("userName", jsonStr[i].userName);
					setStorage("score", jsonStr[i].score);
					setStorage("manager", jsonStr[i].manager);
					setStorage("sureSeller", jsonStr[i].sureSeller);
					var read = new Wilddog("https://bookcity2017.wilddogio.com/users/" + i + "/buyBooks");
					var count = 0;
					read.on('value', function(snap) {
						var readNum = snap.val();
						for(i in readNum) {
							count++;
						}
						console.log(count);
						setStorage("readNum", count);
					});
					break;
				}
			}
			if(status == 0) {
				mui.alert("用户名或密码错误");
			}
		});

	});

	$("#cancle").click(function() {
		window.location.href = "index.html";
	});

	//注册
	var storeName = "";
	$(".seller").on('tap', function() {
		if($(".seller").hasClass("mui-active")) {
			var btnArray = ['取消', '确定'];
			mui.prompt('请输入您的店名：', '', '', btnArray, function(e) {
				if(e.index == 1) {
					storeName = e.value;
				} else {
					$(".seller").removeClass("mui-active");
				}
			});
		} else {
			mui.alert("您取消申请为商家");
		}
	});

	function gitUserMsg() {
		var username = $("#username").val();
		var phone = $("#phone").val();
		var email = $("#email").val();
		var password = $("#password").val();
		var surePassword = $("#surePassword").val();
		var seller = 0;
		if($("#sex li:first-of-type").hasClass("mui-selected")) {
			var sex = "男";
		} else {
			sex = "女";
		}
		if($(".seller").hasClass("mui-active")) {
			seller = 1;
		}

		if($.trim(username).length == 0 ||
			$.trim(phone).length == 0 ||
			$.trim(email).length == 0 ||
			$.trim(password).length == 0) {
			mui.alert("您还有未输入的信息");
			return;
		}

		var isSign = 0;
		console.log(jsonStr);
		for(i in jsonStr) {
			console.log(jsonStr[i].username)
			if(username == jsonStr[i].userName) {
				mui.alert("该用户名已经有人使用！");
				isSign = 1;
				break;
			}
			if(phone == jsonStr[i].phone) {
				mui.alert("该手机已经注册过！");
				isSign = 1;
				break;
			}

			if(email == jsonStr[i].email) {
				mui.alert("该邮箱已经注册过！");
				isSign = 1;
				break;
			}
		}

		if(isSign == 1) {
			return;
		}

		var ref = new Wilddog("https://bookcity2017.wilddogio.com/users");
		var newref = ref.push({
			"userName": username,
			"phone": phone,
			"email": email,
			"password": password,
			"sex": sex,
			"score": 10,
			"manager": 0,
			"seller": seller
		});
		var postID = newref.key();
		mui.alert("注册成功", function() {
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/users/" + postID);
			ref.update({
				"key": postID
			});
			if(storeName != "") {
				ref.update({
					"storeName": storeName,
					"explain": "店家还没有描述自己的店哦~"
				});
			}
		});
	}

	$("#gitMsg").on('tap', function() {
		gitUserMsg();
	});
	window.gitUserMsg = gitUserMsg;
})