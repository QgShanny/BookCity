require.config({
	paths: {
		"jquery": "lib/jquery-1.9.1",
		"mui": "lib/mui.min",
		"reader":"reader",
		"data":"data"
	},
	shim: {
		//no
	}
});
	define(['jquery','mui','reader','data'], function() {
		
	
	getBookMsg(getStorageNow('imgUrl'),getStorageNow('bookName'),getStorageNow('author'),getStorageNow('classIs'),getStorageNow('from'),getStorageNow('msg'));
//	$("#bookImg").attr("src","http://static.book.hao123.com/upload/hao123/cover/2/10/50430_2_1592508.jpg");
	console.log($("#bookMsg"));
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
		var collectNum = getStorageNow('key');
		var userKey = getStorageNow('userKey');
		ref = new Wilddog("https://bookcity2017.wilddogio.com/users/"+userKey+"/collections");
		var newref = ref.push({
			collection:collectNum
		});
		var postId = newref.key();
		mui.alert("收藏成功",function(){
			ref = new Wilddog("https://bookcity2017.wilddogio.com/users/"+userKey+"/collections/"+postId);
			ref.update({
				key:postId
			});
		});
	})
});