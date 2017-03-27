define(['jquery', 'localStorage'], function() {

	var offset1 = $("#bookCase").offset().left;
	$("#theme").css("left", offset1);

	$("#headerNav li").on('tap', function() {
		var index = $(this).index();
		$("#wrapCity").css("left", "-" + index * 100 + "%");
		$("#wrapCity").css("transition", "1s");
		if(index == 0) {
			var offset1 = $("#headerNav li:nth-of-type(1)").offset().left;
			$("#theme").css("left", offset1);
			$("#theme").css("transition", "1s");
			$("#headerNav li:first-of-type a").css("color", "white");
			$("#headerNav li:first-of-type a").css("transition", "1s");
			$("#headerNav li:nth-of-type(2) a").css("color", "black");
			$("#headerNav li:nth-of-type(2) a").css("transition", "1s");
		} else {
			var offset2 = $("#headerNav li:nth-of-type(2)").offset().left;
			$("#theme").css("left", offset2);
			$("#theme").css("transition", "1s");
			$("#headerNav li:first-of-type a").css("color", "black");
			$("#headerNav li:first-of-type a").css("transition", "1s");
			$("#headerNav li:nth-of-type(2) a").css("color", "white");
			$("#headerNav li:nth-of-type(2) a").css("transition", "1s");
		}
	});

	$("#bookCityNav li").on('tap', function() {
		var index = $(this).index();
		$("#bookCityMore").css("left", "-" + index * 100 + "%");
		$("#bookCityMore").css("transition", "1s");
		$("#themeSecond").css("left", index * 25 + "%");
		$("#themeSecond").css("transition", "1s");
	});

	//搜索页面的展示
	$("#selectPage").on('tap', function() {
		$("#select").css("left", "0");
		$("#select").css("transition", "0.5s");
	});
	$("#back").on('tap', function() {
		$("#select").css("left", "100%");
		$("#select").css("transition", "0.5s");
	});
	$("#searchBook").on('tap', function() {

	});

	$("#logout").on('tap', function() {
		var A = [];
		A.push("userId");
		A.push("userName");
		A.push("score");
		A.push("manager");
		removeItems(A);
		mui.alert("退出成功！", function() {
			window.location.href = "index.html";
		});
	});
	$("#username").on('tap', function() {
		window.location.href = "login.html";
	});

	$("#manage").on('tap', function() {
		var userObj = localStorage.getItem("userId");
		if(userObj == null) {
			var btnArray = ['取消', '确认'];
			mui.confirm("您未登录,是否登录？", "", btnArray, function(e) {
				//回调方法内容
				if(e.index == 1) {
					window.location.href = "login.html";
				}
			});
			return;
		}
		var isManger = getStorageNow("manager");
		if(isManger == "1") {
			window.location.href = "manager/index.html";
		} else {
			mui.alert("对不起，您没有权限进入后台管理！");
		}
	});
	//首页点击阅读
	$(".read").on('tap', function() {
		window.location.href = 'reader/reader.html';
	});

	var bookDetail = function(bookName,author,from,Class,imgUrl,msg){
		
	}
})