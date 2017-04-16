define(['jquery'], function() {
	var btnArray = ['取消', '确认'];
		//	意见反馈
	$("#submitSuggest").on('tap', function() {
		var flag = sign("userKey");
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
					var ref = new Wilddog("https://bookcity2017.wilddogio.com/suggests");
					var newRef = ref.push({
						"userName": getStorageNow('userName'),
						"content": e.value,
						"time": year + "/" + month + "/" + day + " " + hh + ":" + mm + ":" + ss
					});
					var flag = updateScore(5,1);
					mui.alert("反馈成功，增加5个积分");
					console.log(e.value + " 已插入云数据库");
				}
			});
		}
	});
	//	搜索功能
	var searchBook = function() {
		$("#searchResult li").css("display", "none");
		var keywrod = $("#keyword").val();
		if($.trim(keywrod).length != 0) {
			for(var i = 0; i < $("#searchResult li").length; i++) {
				var str1 = $("#searchResult li").eq(i).text();
				var str2 = keywrod;
				if(str1.search(str2) != -1) {
					$("#searchResult li").eq(i).css("display", "block");
				}
			}
		} 
	}

	$(".search .mui-icon-clear").on('tap', function() {
		$("#searchResult li").css("display", "none");
	});
	
	$(document).on('tap','#searchResult li',function(){
		var bookKey = $(this).attr('key');
		var bookName = $(this).text();
		$("#keyword").val(bookName);
		$("#keyword").attr("bookKey",bookKey);
	});
	
	$("#searchBook").on('tap',function(){
		setStorage("bookKey",$("#keyword").attr("bookKey"));
		window.location.href = 'bookDetail.html';
	});
	
	//	收藏店家
	$(document).on('tap', '.collectStore', function() {
		var signflag = sign("userKey");
		if(signflag != 1) {
			return;
		}
		var key = $(this).attr("key");
		ref = new Wilddog("https://bookcity2017.wilddogio.com/users/" + getStorageNow("userKey") + "/collectionStore");
		if($(this).hasClass('icon-aixin')){
			$(this).attr("key","");
			$(this).addClass('icon-heart');
			$(this).removeClass('icon-aixin');
//			ref.child(key).remove();
			mui.toast('你取消收藏了');
//			mui.confirm('确认取消收藏该店家吗？', '', btnArray, function(e) {
//				if(e.index == 1){
//					ref.child(key).remove();
//					temp.attr("key","");
//					temp.addClass('icon-aixin');
//					temp.removeClass('icon-heart');
//					mui.alert("取消成功");
//				}
//			});			
			return;
		}
		var key = $(this).parent().attr("storeid");
		var newref = ref.push({
			storeKey: key
		});
		updateScore(5, 1);
		mui.alert("收藏成功，增加5个积分");
	})
	window.searchBook = searchBook;
})