require.config({
	paths: {
		"jquery": "lib/jquery-1.9.1",
		"mui": "lib/mui.min",
		"localStorage": "localStorage",
		"login": "login"
	},
	shim: {
		//no
	}

});
define(['jquery', 'mui', 'localStorage', 'login'], function() {

	var jsonStr; //用户的json数据
	var usersArr = [];
	var temp;
	var ref = new Wilddog("https://bookcity2017.wilddogio.com/Users");

	//on 有变化就读取
	ref.on("value", function(snapshot) {
		var jsonStr = snapshot.val();
		for(i in jsonStr) {
			usersArr.push(jsonStr[i]);
		}
	});

	$("#login").click(function() {
		var phone = $.trim($("#phone").val());
		var password = $.trim($("#password").val());
		if(phone.length == 0 || password.length == 0) {
			mui.alert("请输入正确的用户名和密码");
			return;
		}
		//	console.log(usersArr[0].Phone);
		//	console.log(usersArr[0].Password);
		var status = 0;
		for(i in usersArr) {
			console.log(usersArr[i].Phone + "  " + usersArr[i].Password);
			if(phone == usersArr[i].Phone && password == usersArr[i].Password) {
				mui.alert(usersArr[i].UserName + " 登录成功", function() {
					window.location.href = "index.html";
				});
				status = 1;
				setStorage("userId", usersArr[i].Phone);
				setStorage("userName", usersArr[i].UserName);
				setStorage("score", usersArr[i].Score);
				setStorage("manager", usersArr[i].Manager);
				temp = i;
				break;
			}
		}
		if(status == 0) {
			mui.alert("用户名或密码错误");
		}
	});

	$("#cancle").click(function() {
		window.location.href = "index.html";
	});

	//注册
	var ref = new Wilddog("https://bookcity2017.wilddogio.com");

	function gitUserMsg() {
		var username = $("#username").val();
		var phone = $("#phone").val();
		var email = $("#email").val();
		var password = $("#password").val();
		var surePassword = $("#surePassword").val();
		if($("#sex li:first-of-type").hasClass("mui-selected")) {
			var sex = "男";
		} else {
			sex = "女";
		}

		if($.trim(username).length == 0 ||
			$.trim(phone).length == 0 ||
			$.trim(email).length == 0 ||
			$.trim(password).length == 0) {
			mui.alert("您还有未输入的信息");
			return;
		}

		var isSign = 0;
		for(i in usersArr) {
			if(username == usersArr[i].UserName) {
				mui.alert("该用户名已经有人使用！");
				isSign = 1;
				break;
			}
			if(phone == usersArr[i].Phone) {
				mui.alert("该手机已经注册过！");
				isSign = 1;
				break;
			}

			if(email == usersArr[i].Email) {
				mui.alert("该邮箱已经注册过！");
				isSign = 1;
				break;
			}
		}

		if(isSign == 1) {
			return;
		}

		var postsRef = ref.child("Users");

		postsRef.push({
			"UserName": username,
			"Phone": phone,
			"Email": email,
			"Password": password,
			"Sex": sex,
			"Score": 10,
			"Manager": 0
		});

		mui.alert("数据插入成功");
	}

	window.gitUserMsg = gitUserMsg;
})