require.config({
	paths: {
		"jquery": "lib/jquery-1.9.1",
		"mui": "lib/mui.min",
//		"reader": "reader",
		"data": "data",
		"localStorage": "localStorage"
	},
	shim: {
		//no
	}
});
define(['jquery', 'mui', 'data','localStorage'], function() {
	var getStoreMsg = function(){
		var ref = new Wilddog("https://bookcity2017.wilddogio.com/users/"+getStorageNow("storeKey"));
		ref.on('value',function(snap){
			var storeJson = snap.val();
			if(storeJson.userHead!=null){
				$(".userHead").attr("src",storeJson.userHead);
			}
			$(".storeName").text(storeJson.storeName);
		    $(".storeDescription").text(storeJson. explain);
		    $(".StoreName").text(storeJson.userName);
		});
	}
	getStoreMsg();
	var jsonStr;
	var bookList = "";
	var ref = new Wilddog("https://bookcity2017.wilddogio.com/sale");
	ref.once('value',function(snapshot){;
		jsonStr = snapshot.val();
		for(i in jsonStr){
			if(jsonStr[i].saler != getStorageNow("storeKey")){
				continue;
			}
			bookList += '<a class="book" num='+i+'><img src="'+jsonStr[i].imgUrl+'"/><p class="bookName">'+jsonStr[i].bookName+'</p><p class="price">'+jsonStr[i].price+'</p>'
			  + '<p class="upTime">上线时间：'+jsonStr[i].updateTime+'<span></span></p><button type="button" class="mui-btn mui-btn-primary mui-btn-outlined readMore" bookKey="'+jsonStr[i].key+'">了解详情</button></a>'
			  + '<div class="clearfix"></div>';
		}
		$(".allBooks").html(bookList);
	});
	
	$(function(){
		$(document).on('tap','.readMore',function(){
			var i = $(this).parent('.book').attr("num");
			setStorage("bookKey",i);
			setStorage("bookType","sale");
//			setStorage('imgUrl',jsonStr[i].imgUrl);
//			setStorage('bookName',jsonStr[i].bookName);
//			setStorage('author',jsonStr[i].author);
//			setStorage('classIs',jsonStr[i].Class);
//			setStorage('from',jsonStr[i].from);
//			setStorage('msg',jsonStr[i].msg);
			window.location.href = "bookDetail.html";
		});
	})
	
	
});