require.config({
	paths: {
		"jquery": "lib/jquery-1.9.1",
		"mui": "lib/mui.min",
	},
	shim: {
		//no
	}

});
define(['jquery', 'mui'], function() {

	var flagBar = 0;
	var flagFont = 0; //字体背景的设置标识
	$("#bookcontainer").on("tap", function() {
		//	$("#bookcontainer").click(function(){
		if(flagFont == 1) {
			$("#detailSet").css("bottom", "-172px");
			flagFont = 0;
		} else {
			if(flagBar == 0) {
				$("#readerHead").css("top", "0px");
				$("#readerSet").css("bottom", "0px");
				flagBar = 1;
			} else {
				$("#readerHead").css("top", "-44px");
				$("#readerSet").css("bottom", "-80px");
				flagBar = 0;
			}
			$("#readerHead").css("transition", "0.5s");
			$("#readerSet").css("transition", "0.5s");
		}
	});

	var flagLight = 0;
	$("#readerSet li:nth-of-type(2) a").on('tap', function() {
		if(flagLight == 0) {
			$("#bookcontainer").css("background", "black");
			$("#readerSet li:nth-of-type(2) a span").text("夜间");
			flagLight = 1;
		} else {
			$("#bookcontainer").css("background", "lightgoldenrodyellow");
			$("#readerSet li:nth-of-type(2) a span").text("日间");
			flagLight = 0;
		}
	});

	$("#readerSet ul li:nth-of-type(3)").on('tap', function() {
		$("#readerHead").css("top", "-44px");
		$("#readerSet").css("bottom", "-80px")
		$("#detailSet").css("bottom", "0");
		flagFont = 1;
		flagBar = 0;
	});

	$("#jianFontSize").on('tap', function() {
		var temp = $("#fontSizeSpan").text();
		temp = parseInt(temp);
		if(temp == 10) {
			return;
		}
		temp -= 1;
		$("#fontSizeSpan").text(temp);
		$("#bookcontainer h4").css("font-size", temp + 2 + "px");
		$("#bookcontainer p").css("font-size", temp + "px");
	});
	$("#addFontSize").on('tap', function() {
		var temp = $("#fontSizeSpan").text();
		temp = parseInt(temp);
		if(temp == 10) {
			return;
		}
		temp += 1;
		$("#fontSizeSpan").text(temp);
		$("#bookcontainer h4").css("font-size", temp + 2 + "px");
		$("#bookcontainer p").css("font-size", temp + "px");
	});

	var spanLen = document.getElementById("fontColorDiv").getElementsByTagName("span");
	for(var i = 0; i < spanLen.length; i++) {
		(function() {
			var p = i + 1;
			$("#fontColorDiv span:nth-of-type(" + p + ")").on('tap', function() {
				$("#bookcontainer").css("background", $("#fontColorDiv span:nth-of-type(" + p + ")>i").css("background"));
			});
		})();
	}

	$("#moreColor").on('tap', function() {
		Jcolor(this).color();
	});

	//标签内容一改变，触发的函数
	$("#moreColor").bind('DOMNodeInserted', function(e) {
		alert('element now contains: ' + $(e.target).html());
	});
	
	//双击回顶部
	$("#readerHead").on('tap',function(){
		var time = new Date().getTime();
		$("#readerHead").on('tap',function(){
			if(new Date().getTime() - time < 1000){
				$('html,body').stop().animate({scrollTop: '0px'},500)				
			}
		});
	})

	var bookNode = 1;
	getArticle(bookNode);
	function getArticle(bookNode){
		$.getJSON("../../json/test"+bookNode+".json", function(data) {
			var $jsontip = $("#article");
			var strHtml = ""; //存储数据的变量 
			$jsontip.empty(); //清空内容 
			$.each(data, function(infoIndex, info) {
				var contentLen = info.content.length;
				strHtml += "<h4 class='articleTitle'>" + info["title"] + "</h4>";
				for(var i = 0;i<contentLen;i++){
					strHtml += "<p>" + info["content"][i]["detail"] + "</p>";
				}
			})
			$jsontip.html(strHtml); //显示处理后的数据 
		})
	}
	$("#pre").on('tap',function(){
//		$("#bookcontainer").unbind();
		bookNode--;
		getArticle(bookNode);
		$('html,body').stop().animate({scrollTop: '0px'},0)
	});	
	$("#next").on('tap',function(){
//		$("#bookcontainer").unbind();
		bookNode++;
		getArticle(bookNode);
		$('html,body').stop().animate({scrollTop: '0px'},0)
	});

})