require.config({
	paths: {
		"jquery": "lib/jquery-1.9.1",
		"mui": "lib/mui.min",
		"localstorage":'localStorage'
	},
	shim: {
		//no
	}

});
define(['jquery', 'mui','localstorage'], function() {

	mui.init()
	mui.ready(function() {
		mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005
		});
	});

	//记录用户的阅读章节和习惯
	var refRead = new Wilddog("https://bookcity2017.wilddogio.com/users/"+getStorageNow("userKey")+"/read");
	refRead.once("value",function(snap){
		var jsonStr = snap.val();
		if(jsonStr != null){
//			阅读章节
			var bookNode = jsonStr.chap;
			getArticle(bookNode);		
			
//			阅读器的白天黑夜模式
			var flagLight = jsonStr.flagLight;
			if(flagLight != null){
				if(flagLight == 1){
					$("#bookcontainer").css("background", "black");
					$("#readerSet li:nth-of-type(2) a span").text("夜间");
					$(".articleTitle").css("color", "#8f8f94");
					flagLight = 1;					
				}
				else{
					$("#bookcontainer").css("background", "lightgoldenrodyellow");
					$("#readerSet li:nth-of-type(2) a span").text("日间");
					$(".articleTitle").css("color", "black");
					flagLight = 0;
				}
			}
			
//			字体大小，暂时还不可做到
//			var fontSize = jsonStr.fontSize;
//			console.log(fontSize);
//			if(fontSize!=null){
//				$("#fontSizeSpan").text(fontSize);
//				$("#bookcontainer h4").css("font-size", fontSize + 2 + "px");
//				$("#bookcontainer p").css("font-size", fontSize + "px");	
//			}
			
//			阅读器的背景颜色
			var bgColor = jsonStr.bgColor;
			if(bgColor!=null){
				$("#bookcontainer").css("background", bgColor);
			}
		}
		else{
			getArticle(1);
		}
	})
	
	//返回首页
	$("#backIndex").on('tap', function() {
		window.location.href = '../index.html';
	});
	
	var flagBar = 0;
	var flagFont = 0; //字体背景的设置标识
	$("#bookcontainer").on("tap", function() {
		if(flagFont == 1) {
			//			$("#detailSet").css("bottom", "-172px");
			$("#detailSet").fadeOut('fast');
			flagFont = 0;
		} else {
			if(flagBar == 0) {
				//				$("#readerHead").css("top", "0px");
				//				$("#readerSet").css("bottom", "0px");
				$("#readerHead").fadeIn('fast');
				$("#readerSet").fadeIn('fast');
				flagBar = 1;
			} else {
				//				$("#readerHead").css("top", "-44px");
				//				$("#readerSet").css("bottom", "-80px");
				$("#readerHead").fadeOut('fast');
				$("#readerSet").fadeOut('fast');
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
			$(".articleTitle").css("color", "#8f8f94");
			flagLight = 1;
			refRead.update({
				flagLight:1
			});
		} else {
			$("#bookcontainer").css("background", "lightgoldenrodyellow");
			$("#readerSet li:nth-of-type(2) a span").text("日间");
			$(".articleTitle").css("color", "black");
			flagLight = 0;
			refRead.update({
				flagLight:0
			});
		}
	});

	$("#readerSet ul li:nth-of-type(3)").on('tap', function() {
		$("#readerHead").fadeOut('fast');
		$("#readerSet").fadeOut('fast');
		$("#detailSet").css("bottom", "0");
		flagFont = 1;
		flagBar = 0;
	});

	$("#jianFontSize").on('tap', function() {
		var temp = $("#fontSizeSpan").text();
		temp = parseInt(temp);
		temp -= 1;
		if(temp == 9) {
			return;
		}
		$("#fontSizeSpan").text(temp);
		$("#bookcontainer h4").css("font-size", temp + 2 + "px");
		$("#bookcontainer p").css("font-size", temp + "px");
		refRead.update({
			fontSize:temp
		});
	});
	$("#addFontSize").on('tap', function() {
		var temp = $("#fontSizeSpan").text();
		temp = parseInt(temp);
		temp += 1;
		if(temp == 31) {
			return;
		}
		$("#fontSizeSpan").text(temp);
		$("#bookcontainer h4").css("font-size", temp + 2 + "px");
		$("#bookcontainer p").css("font-size", temp + "px");
		refRead.update({
			fontSize:temp
		});
	});

	if($("#fontColorDiv").length > 0) {
		var spanLen = document.getElementById("fontColorDiv").getElementsByTagName("span");
		for(var i = 0; i < spanLen.length; i++) {
			(function() {
				var p = i + 1;
				$("#fontColorDiv span:nth-of-type(" + p + ")").on('tap', function() {
					$("#bookcontainer").css("background", $("#fontColorDiv span:nth-of-type(" + p + ")>i").css("background"));
					if(p == 1) {
						$("#article>p,.articleTitle").css("color", "rgba(255, 255, 255, 0.9)");
					} else {
						$("#article>p").css("color", "#8f8f94");
						$(".articleTitle").css("color", "black");
					}
				});
			})();
		}

		var fontSpaceLen = document.getElementById("fontSpace").getElementsByTagName("span");
		for(var i = 0; i < fontSpaceLen.length; i++) {
			(function() {
				var p = i + 1;
				$("#fontSpace span:nth-of-type(" + p + ")").on("tap", function() {
					var h = 15 + 5 * p;
					var w = p;
					$("#article>p").css("line-height", h + "px");
					$("#article>p").css("letter-spacing", w + "px");
				});
			})()
		}
	}
	//	$("#moreColor").on('tap', function() {
	//		Jcolor(this).color();
	//	});

	//标签内容一改变，触发的函数
	$("#moreColor").bind('DOMNodeInserted', function(e) {
		alert('element now contains: ' + $(e.target).html());
	});

	//双击回顶部
	$("#readerHead").on('tap', function() {
		var time = new Date().getTime();
		$("#readerHead").on('tap', function() {
			if(new Date().getTime() - time < 1000) {
				$('html,body').stop().animate({
					scrollTop: '0px'
				}, 500)
			}
			//window.scrollTo(0,0); 
		});
	});
	
	
	$(function() {
		$(document).on('tap', '#pre', function() {
			bookNode--;
			if(bookNode < 1) {
				mui.alert("已经是第一章了");
				return;
			}
			getArticle(bookNode);
			$('html,body').stop().animate({
				scrollTop: '0px'
			}, 0)
		});
		$(document).on('tap', '#next', function() {
			bookNode++;
			if(bookNode > 3) {
				mui.alert("已经是最后一章了");
				return;
			}
			getArticle(bookNode);
			$('html,body').stop().animate({
				scrollTop: '0px'
			}, 0)
		});
	})

	$("#readerSet ul li:first-of-type").on('tap', function() {
		$("#catalog").css("left", "0");
		$("#readerHead,#readerSet").fadeOut('fast');
		$("#catalog").css('transition', '0.5s');

	});
	$("#back").on('tap', function() {
		$("#catalog").css('left', '100%');
		$("#catalog").css('transition', '0.5s');
		flagBar = 0;
	});

	if($("#fontColorDiv").length > 0) {
		var spanLen = document.getElementById("fontColorDiv").getElementsByTagName("span");
		for(var i = 0; i < spanLen.length; i++) {
			(function() {
				var p = i + 1;
				$("#fontColorDiv span:nth-of-type(" + p + ")").on('tap', function() {
					$("#bookcontainer").css("background", $("#fontColorDiv span:nth-of-type(" + p + ")>i").css("background"));
					refRead.update({
						bgColor:$("#fontColorDiv span:nth-of-type(" + p + ")>i").css("background")
					})
				});
			})();
		}
		//	目录里的目录,书签,笔记
		for(var i = 0; i < 3; i++) {
			(function() {
				var p = i + 1;
				$("#catalogClass li:nth-of-type(" + p + ")").on('tap', function() {
					$("#catalogClass li:nth-of-type(" + p + ")").css("border-bottom", "solid #23a3d5 2px");
					$("#catalogClass li:nth-of-type(" + p + ")").siblings().css("border-bottom", "none");
					$(".catalogD").css("display", "none");
					$(".catalogD").eq(p - 1).css("display", "block");
				});
			})()
		}
		//	目录里的章节
		var chapterLen = $(".chapter li").length;
		for(var i = 0; i < chapterLen; i++) {
			(function() {
				var p = i + 1;
				$(".chapter li:nth-of-type(" + p + ") a").on('tap', function() {
					getArticle(p);
					$("#catalog").css("left", "100%");
					refRead.update({
						"chap":p
					});
				});
			})()
		}
	}
	
	

	

	function getArticle(bookNode) {
		$.getJSON("../../json/test" + bookNode + ".json", function(data) {
			var $jsontip = $("#article");
			var strHtml = ""; //存储数据的变量 
			$jsontip.empty(); //清空内容 
			$.each(data, function(infoIndex, info) {
				var contentLen = info.content.length;
				strHtml += "<h4 class='articleTitle'>" + info["title"] + "</h4>";
				for(var i = 0; i < contentLen; i++) {
					strHtml += "<p>" + info["content"][i]["detail"] + "</p>";
				}
			});
			strHtml += "<div id='articleBtn'><button type='button' class='mui-btn mui-btn-outlined' id='pre'>上一章</button><button type='button' class='mui-btn mui-btn-outlined' id='next'>下一章</button></div>";
			$jsontip.html(strHtml); //显示处理后的数据
		})
	}
	window.getArticle = getArticle;
})