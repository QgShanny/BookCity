var flagBar = 0;
var flagFont = 0; //字体背景的设置标识
$("#bookcontainer").on("tap", function() {
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
})

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
})
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
})

window.onload = function() {
	var spanLen = document.getElementById("fontColorDiv").getElementsByTagName("span");
	for(var i = 0; i < spanLen.length; i++) {
		(function() {
			var p = i + 1;
			$("#fontColorDiv span:nth-of-type(" + p + ")").click(function(){
				$("#bookcontainer").css("background", $("#fontColorDiv span:nth-of-type(" + p + ")>i").css("background"));
			});
		})();
	}
}


$("#moreColor").on('tap', function() {
	Jcolor(this).color();
});

//标签内容一改变，触发的函数
$("#moreColor").bind('DOMNodeInserted', function(e) {
	alert('element now contains: ' + $(e.target).html());
});

