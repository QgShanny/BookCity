define(['jquery', 'localStorage'], function() {
	
//	var key = '-KgOKxxDt2HMygjGiy-3';
//	var ref = new Wilddog("https://bookcity2017.wilddogio.com/users/-KgOLjCYaQeLKDYEJryw");
//	ref.update({
//		"manager":1
//	});

	var offset1 = $("#bookCase").offset().left;
	$("#theme").css("left", offset1);

	$("#headerNav li").on('tap', function() {
		var index = $(this).index();
		var flag = 0;
		if(index == 0){bookCityChange(0);flag = 1;}
		if(index == 1){flag = 1;}
		if(index == 2){bookCityChange(3);flag = 1;}
		if(flag == 0) return;
		$("#wrapCity").css("left", "-" + index * 100 + "%");
		$("#wrapCity").css("transition", "1s");
		if(index == 0) {
			var offset1 = $("#headerNav li:nth-of-type(1)").offset().left;
			$("#theme").css("left", offset1);
			$("#theme").css("transition", "1s");
			$("#headerNav li:first-of-type a").css("color", "white");
			$("#headerNav li:first-of-type a").css("transition", "1s");
			$("#headerNav li:nth-of-type(2) a,#headerNav li:nth-of-type(3) a").css("color", "black");
			$("#headerNav li:nth-of-type(2) a,#headerNav li:nth-of-type(3) a").css("transition", "1s");
		} 
		if(index == 1) {
			var offset2 = $("#headerNav li:nth-of-type(2)").offset().left;
			$("#theme").css("left", offset2);
			$("#theme").css("transition", "1s");
			$("#headerNav li:first-of-type a,#headerNav li:nth-of-type(3) a").css("color", "black");
			$("#headerNav li:first-of-type a,#headerNav li:nth-of-type(3) a").css("transition", "1s");
			$("#headerNav li:nth-of-type(2) a").css("color", "white");
			$("#headerNav li:nth-of-type(2) a").css("transition", "1s");
		}
		if(index == 2) {
			var offset3 = $("#headerNav li:nth-of-type(3)").offset().left;
			$("#theme").css("left", offset3);
			$("#theme").css("transition", "1s");
			$("#headerNav li:first-of-type a,#headerNav li:nth-of-type(2) a").css("color", "black");
			$("#headerNav li:first-of-type a,#headerNav li:nth-of-type(2) a").css("transition", "1s");
			$("#headerNav li:nth-of-type(3) a").css("color", "white");
			$("#headerNav li:nth-of-type(3) a").css("transition", "1s");
		}
	});

	$("#bookCityNav li").on('tap', function() {
		var index = $(this).index();
		$("#bookCityMore").css("left", "-" + index * 100 + "%");
		$("#bookCityMore").css("transition", "1s");
		$("#themeSecond").css("left", index * 25 + "%");
		$("#themeSecond").css("transition", "1s");
	});

	function bookCityChange(index){
		$("#bookCityMore").css("left", "-" + index * 100 + "%");
		$("#bookCityMore").css("transition", "1s");
		$("#themeSecond").css("left", index * 25 + "%");
		$("#themeSecond").css("transition", "1s");
	}
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
		A.push("userKey");
		removeItems(A);
		mui.alert("退出成功！", function() {
			window.location.href = "index.html";
		});
	});
	$("#username").on('tap', function() {
		window.location.href = "login.html";
	});

	$("#manage").on('tap', function() {
		var userObj = localStorage.getItem("userKey");
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
		var isSeller = getStorageNow("sureSeller");
		if(isManger == "1" || isSeller == 1) {
			window.location.href = "manager/index.html";
		} else {
			mui.alert("对不起，您没有权限进入后台管理！");
		}
	});
	//首页点击阅读
	$(".read").on('tap', function() {
		window.location.href = 'reader/reader.html';
	});

//	点击进入商家
	$(function(){
		$(document).on('tap', '.storeImg',function(){
			var key = $(this).parent().attr("storeid");
			var storeName = $(this).find('h5').text();
			var storaDecription = $(this).find('p').text();
			var userName = $(this).attr('storeuser');
			setStorage("storeKey",key);
			console.log(getStorageNow("storeKey"));
			window.location.href = 'store.html';
		});		
	});
	
	//进入个人资料
	$("#mySelf").on('tap',function(){
		var flag = sign("userKey");
		console.log(flag);
		if(flag == 1){
			window.location.href = 'self/self.html';
		}
	});
	
	//我的收藏
	$("#myCollect").on('tap',function(){
		var flag = sign("userKey");
		console.log(flag);
		if(flag == 1){
			window.location.href = 'self/collection.html';
		}
	});
	
//	版本信息
	$("#msg").on('tap',function(){
		window.location.href = 'msg.html';
	});
	
// 女生频道
	$("#girlAll").on('tap',function(){
		setStorage("booksType","女生");
		window.location.href = 'allBook.html';
	});
// 男生频道
	$("#boyAll").on('tap',function(){
		setStorage("booksType","男生");
		window.location.href = 'allBook.html';
	});
// 免费频道
	$("#free").on('tap',function(){
		setStorage("booksType","免费");
		window.location.href = 'allBook.html';
	});
	
//	我的书架
	$("#mybookShelf").on('tap',function(){
		mui.alert("你还没有书哦，快到书城去挑选吧！")
	});

})