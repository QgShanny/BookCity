require.config({
	paths: {
		"jquery": "lib/jquery-1.9.1",
		"mui": "lib/mui.min",
		//		"reader":"reader",
		"data": "data"
	},
	shim: {
		//no
	}
});
define(['jquery', 'mui', 'data'], function() {
	var btnArray = ['取消', '确认'];
	getBookMsg(getStorageNow("bookKey"));
	for(var i = 0; i < 2; i++) {
		(function() {
			var p = i + 1;
			$("#bookClass li:nth-of-type(" + p + ")").on('tap', function() {
				$("#bookClass li:nth-of-type(" + p + ")").css("border-bottom", "solid #23a3d5 2px");
				$("#bookClass li:nth-of-type(" + p + ")").siblings().css("border-bottom", "none");
				if(p == 1) {
					$(".bookChapter").css("display", "none");
					$(".bookIntroduce").css("display", "block");
				} else {
					$(".bookIntroduce").css("display", "none");
					$(".bookChapter").css("display", "block");
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

	//	收藏书籍
	$("#collection").on('tap', function() {
		var signflag = sign("userKey");
		if(signflag != 1) {
			return;
		}
		var collectNum = getStorageNow('bookKey');
		var userKey = getStorageNow('userKey');
		ref = new Wilddog("https://bookcity2017.wilddogio.com/users/" + userKey + "/collectionbook");
		var newref = ref.push({
			bookKey: collectNum
		});
		updateScore(5,1);
		mui.alert("收藏成功,增加5个积分");
	});
	//	打赏书籍
	$("#giveScore").on('tap', function() {
		var signflag = sign("userKey");
		if(signflag != 1) {
			return;
		}
		mui.prompt('请输入您要打赏的积分数：', '将使用你的积分进行打赏', '', btnArray, function(e) {
			if(e.index == 1) {
				var flag = updateScore(e.value, 0);
				if(flag != 1) {
					return;
				}
				var ref = new Wilddog("https://bookcity2017.wilddogio.com/books/" + getStorageNow('bookKey'));
				var allScore;
				ref.once('value', function(snap) {
					allScore = snap.val().getScore;
					if(allScore == null) {
						allScore = 0;
					} else {
						allScore = allScore
					}
				});
				ref.update({
					getScore: parseInt(e.value) + parseInt(allScore)
				})
			}
		});

	});

	function getBookMsg(key) {
		if(getStorageNow("bookType") == "sale") {
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/sale/" + key);
		} else {
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/books/" + key);
		}
		ref.on('value', function(snap) {
			var jsonStr = snap.val();
			$("#bookImg").attr("src", jsonStr.imgUrl);
			$(".bookName").text(jsonStr.bookName);
			$("#author").text(jsonStr.author);
			$("#from").text(jsonStr.from);
			$("#classIs").find('span').text(jsonStr.Class);
			$(".bookIntroduce").text(jsonStr.msg);
		})
	}

	$('#read').on('tap', function() {
		var signflag = sign("userKey");
		if(signflag != 1) {
			return;
		}
		if(getStorageNow("bookType") == "sale") {
			mui.alert("已复制好购买链接，可到浏览器粘贴打开");
		} else {
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/books/" + getStorageNow("bookKey"));
			ref.on('value', function(snap) {
				var score = snap.val().bookScore;
				mui.confirm("此书需要" + score + "积分，确认要购买吗？", '', btnArray, function(e) {
					//	回调方法内容
					var flag = updateScore(score, 0);
					if(flag != 1) {
						return;
					}
					var ref = new Wilddog("https://bookcity2017.wilddogio.com/users/" + getStorageNow("userKey") + "/buyBooks");
					ref.push({
						buy: getStorageNow("bookKey")
					});
					var readNum = getStorageNow("readNum");
					setStorage("readNum", readNum + 1);
					setTimeout(function() {
						window.location.href = 'reader/reader.html';
					}, 2000);
				})
			})
		}
	});

	if(getStorageNow("bookType") == "sale") {
		$("#read").text("购买");
	} else {
		$("#read").text("阅读");
	}
});