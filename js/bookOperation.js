require.config({
	paths: {
		"jquery": "lib/jquery-1.9.1",
		"mui": "lib/mui.min",
//		"reader":"reader",
		"data":"data"
	},
	shim: {
		//no
	}
});
	define(['jquery','mui','data'], function() {
		
	
//	getBookMsg(getStorageNow('imgUrl'),getStorageNow('bookName'),getStorageNow('author'),getStorageNow('classIs'),getStorageNow('from'),getStorageNow('msg'));
	getBookMsg(getStorageNow("bookKey"));
	for(var i = 0; i < 2; i++) {
		(function() {
			var p = i + 1;
			$("#bookClass li:nth-of-type(" + p + ")").on('tap', function() {
				$("#bookClass li:nth-of-type(" + p + ")").css("border-bottom", "solid #23a3d5 2px");
				$("#bookClass li:nth-of-type(" + p + ")").siblings().css("border-bottom", "none");
				if(p == 1){
					$(".bookChapter").css("display","none");
					$(".bookIntroduce").css("display","block");
				}else{
					$(".bookIntroduce").css("display","none");
					$(".bookChapter").css("display","block");			
				}
			});
		})()
	}
	
	//	目录里的章节
	var chapterLen = $(".bookChapter li").length;
	for(var i = 0; i < chapterLen; i++) {
		(function() {
			var p = i + 1;
			$(".bookChapter li:nth-of-type(" + p + ") a").on('tap', function() {
				getArticle(p);
				window.location.href = 'reader/reader.html';
			});
		})()
	}
	
//	收藏
	$("#collection").on('tap',function(){
		var collectNum = getStorageNow('bookKey');
		var userKey = getStorageNow('userKey');
		ref = new Wilddog("https://bookcity2017.wilddogio.com/users/"+userKey+"/collectionbook");
		var newref = ref.push({
			bookKey:collectNum
		});
		mui.alert("收藏成功");
		
	})
	
	function getBookMsg(key){
		if(getStorageNow("bookType") == "sale"){
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/sale/"+key);
		}
		else{
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/books/"+key);
		}
		ref.on('value',function(snap){
			var jsonStr = snap.val();
			$("#bookImg").attr("src",jsonStr.imgUrl);
			$(".bookName").text(jsonStr.bookName);
			$("#author").text(jsonStr.author);
			$("#from").text(jsonStr.from);
			$("#classIs").find('span').text(jsonStr.Class);
			$(".bookIntroduce").text(jsonStr.msg);
		})
	}
	
	$('#read').on('tap',function(){
		if(getStorageNow("bookType") == "sale"){
			mui.alert("已复制好购买链接，可到浏览器粘贴打开");
		}
		else{
			window.location.href = 'reader/reader.html';
		}
	});
	
	if(getStorageNow("bookType") == "sale"){
		$("#read").text("购买");
	}
	else{
		$("#read").text("阅读");
	}
});