require.config({
	paths: {
		"jquery": "lib/jquery-1.9.1",
		"mui": "lib/mui.min",
		"data": "data"
	},
	shim: {
		//no
	}

});
define(['jquery', 'mui', 'data'], function() {

	var btnArray = ['取消', '确认'];

	function gitBookMsg() {
		var type = getStorageNow("bookSale"); //type为0表示是从商家处添加书籍
		if(type == 1) {
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/sale");
		} else {
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/books");
		}
		var bookname = $("#bookName").val();
		var author = $("#author").val();
		var from = $("#from").val();
		var classIs = $("#classIs").val();
		var msg = $("#Msg").val();
		var imgUrl = $("#imgUrl").val();
		var buyUrl = $("#buyUrl").val();

		if($.trim(bookname).length == 0 ||
			$.trim(author).length == 0 ||
			$.trim(from).length == 0 ||
			$.trim(classIs).length == 0 ||
			$.trim(msg).length == 0 ||
			$.trim(imgUrl).length == 0 ||
			$.trim(buyUrl).length == 0) {
			mui.alert("您还有未输入的信息");
			return;
		}
		if(type == 1) {
			if($.trim($("#price").val()) == 0) {
				mui.alert("您还有未输入的信息");
				return;
			}
		}
		var newref = ref.push({
			"bookName": bookname,
			"author": author,
			"from": from,
			"Class": classIs,
			"msg": msg,
			"imgUrl": imgUrl
		});

		var postID = newref.key();
		if(type == 1) {
			var now = new Date();
			var year = now.getFullYear(); //年  
			var month = now.getMonth() + 1; //月  
			var day = now.getDate(); //日  
			var time = year + "年" + month + "月" + day + "日";
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/sale/" + postID);
			ref.update({
				"price": $.trim($("#price").val()),
				"buyUrl": $.trim($("#buyUrl").val()),
				"saler": getStorageNow("userKey"),
				"updateTime": time
			});
		}
	}

	// 书籍查询
	var refBook = new Wilddog("https://bookcity2017.wilddogio.com/books");
	//once 只读取一次
	refBook.on("value", function(snapshot) {
		$(".bookItem").remove();
		var jsonStr = snapshot.val();
		var booksArr = [];
		var bookList = "";
		for(i in jsonStr) {
			booksArr.push(jsonStr[i]);
		}
		var temp = 1;
		for(i in booksArr) {
			bookList += "<tr class='bookItem'><td>" + temp + "</td><td>" + booksArr[i].bookName + "</td><td>" + booksArr[i].author + "</td><td><i class='mui-icon mui-icon-trash' key='" + booksArr[i].key + "'></i><i class='mui-icon mui-icon-compose' key='" + booksArr[i].key + "'></i></td></tr>";
			temp++;
		}
		$(bookList).appendTo($("#allBookList"));
		console.log("全部书籍已展示")
	});

	// 用户查询
	var refUser = new Wilddog("https://bookcity2017.wilddogio.com/users");
	//once 只读取一次
	refUser.on("value", function(snapshot) {
		$(".userItem").remove();
		var jsonStr = snapshot.val();
		var userList = "";
		var salerList = "";
		var temp = 1;
		var temp2 = 1;
		for(i in jsonStr) {
			if(jsonStr[i].manager == 1) {
				var identity = "管理员";
			}
			if(jsonStr[i].seller == 1 && jsonStr[i].sureSeller != 1) {
				var identity = "申请商家";
			}
			if(jsonStr[i].manager == 0 && jsonStr[i].seller == 0) {
				var identity = "普通";
			}
			if(jsonStr[i].sureSeller == 1) {
				var identity = "商家";
			}
			userList += "<tr class='userItem'><td>" + temp + "</td><td>" + jsonStr[i].userName + "</td><td>" + jsonStr[i].sex + "</td><td>" + jsonStr[i].phone + "</td><td>" + identity + "</td><td><i class='mui-icon mui-icon-trash' key='" + i + "'></i><i class='mui-icon mui-icon-compose' key='" + i + "'></i></td></tr>";
			temp++;
			if(jsonStr[i].sureSeller == 1) {
				salerList += "<tr class='salerItem'><td>" + temp2 + "</td><td>" + jsonStr[i].userName + "</td><td>" + jsonStr[i].storeName + "</td><td class='manager' key=" + i + " style='color:#23a3d5;'>进入管理</td></tr>";
				temp2++;
			}
		}
		$(userList).appendTo($("#allUserList"));
		$(salerList).appendTo($("#allSaler"));
		console.log("全部用户和商家已展示")
	});

	// 意见查询
	var refSug = new Wilddog("https://bookcity2017.wilddogio.com/suggests");
	//once 只读取一次
	refSug.on("value", function(snapshot) {
		$(".sugItem").remove();
		var jsonStr = snapshot.val();
		var sugList = "";
		for(i in jsonStr) {
			sugList += "<tr class='sugItem'><td>" + jsonStr[i].userName + "</td><td>" + jsonStr[i].content + "</td><td>" + jsonStr[i].time + "</td><td><i class='mui-icon mui-icon-trash' key='" + jsonStr[i].key + "'></i><i class='mui-icon mui-icon-search' key='" + jsonStr[i].key + "'></i></td></tr>";
		}
		$(sugList).appendTo($("#allsugList"));
		console.log("全部意见已展示")
	});

	// 卖家书籍查询
	var saleMsgShow = function(saleKey) {
		var saleMsg = new Wilddog("https://bookcity2017.wilddogio.com/users/" + saleKey);
		saleMsg.on("value", function(snap) {
			var jsonstr = snap.val();
			$("#storeName").text(jsonstr.storeName);
			$("#storeExplain").text(jsonstr.explain);
		});
		$("#storeName").on('tap', function() {
			mui.prompt('请输入你新的店名：', '', '', btnArray, function(e) {
				if(e.index == 1) {
					if($.trim(e.value).length > 0) {
						saleMsg.update({
							storeName: e.value
						});
					}
				}
			});
		});
		$("#storeExplain").on('tap', function() {
			mui.prompt('请输入你新的店描述：', '', '', btnArray, function(e) {
				if(e.index == 1) {
					if($.trim(e.value).length > 0) {
						saleMsg.update({
							explain: e.value
						});
					}
				}
			});
		});
		var saleBook = new Wilddog("https://bookcity2017.wilddogio.com/sale");
		//once 只读取一次
		saleBook.on("value", function(snapshot) {
			$(".saleItem").remove();
			var jsonStr = snapshot.val();
			var bookList = "";
			var temp = 1;
			for(i in jsonStr) {
				if(jsonStr[i].saler != saleKey) {
					continue;
				}
				bookList += "<tr class='saleItem'><td>" + temp + "</td><td>" + jsonStr[i].bookName + "</td><td>" + jsonStr[i].author + "</td><td>￥" + jsonStr[i].price + "</td><td><i class='mui-icon mui-icon-trash' key='" + i + "'></i><i class='mui-icon mui-icon-compose' key='" + i + "'></i></td></tr>";
				temp++;
			}
			$(bookList).appendTo($("#allSaleBookList"));
		});
	}
	if(getStorageNow('Entrance') == 'saler') {
		var saleKey = getStorageNow("userKey");
		setStorage('salerKey', saleKey);
	}	
	saleMsgShow(getStorageNow('salerKey'));
	$("#addBook").on('tap', function() {
		var signFlag = sign('userKey');
		if(signFlag == 1) {
			if($(this).attr("booktype") == 'saler') {
				setStorage("bookSale", "1");
			}
			window.location.href = "addBook.html";
		}
	});

	$("#addUser").on('tap', function() {
		var signFlag = sign('userKey');
		if(signFlag == 1) {
			window.location.href = "../regist.html";
		}
	});

	$(function() {
		//	删除书籍
		$(document).on('tap', '.bookItem .mui-icon-trash', function() {
			var postID = $(this).attr("key");
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/books");
			var btnArray = ['取消', '确认'];
			mui.confirm('确认要删除这本书吗？', '', btnArray, function(e) {
				//回调方法内容
				if(e.index == 1) {
					ref.child(postID).remove();
					console.log("书籍" + postID + "删除成功");
				}
			});
		});
		//	编辑书籍
		$(document).on('tap', '.bookItem .mui-icon-compose', function() {
			var postID = $(this).attr("key");
			console.log(postID);
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/books/" + postID);
			ref.on('value', function(snapshot) {
				$("#bookName").val(snapshot.val().bookName);
				$("#author").val(snapshot.val().author);
				$("#from").val(snapshot.val().from);
				$("#msg").val(snapshot.val().msg);
				$("#classIs").val(snapshot.val().Class);
				$("#imgUrl").val(snapshot.val().imgUrl);
				$("#bookUpdate").fadeIn('fast');
			});
			$("#gitMsg").on('tap', function() {
				var bookname = $("#bookName").val();
				var author = $("#author").val();
				var from = $("#from").val();
				var classIs = $("#classIs").val();
				var msg = $("#msg").val();
				var imgUrl = $("#imgUrl").val();

				if($.trim(bookname).length == 0 ||
					$.trim(author).length == 0 ||
					$.trim(from).length == 0 ||
					$.trim(classIs).length == 0 ||
					$.trim(msg).length == 0 ||
					$.trim(imgUrl).length == 0) {
					mui.alert("您还有未输入的信息");
					return;
				}

				ref.update({
					"bookName": bookname,
					"author": author,
					"from": from,
					"Class": classIs,
					"msg": msg,
					"imgUrl": imgUrl
				});
				mui.alert("修改成功", function() {
					$("#bookUpdate").fadeOut('fast');
				});
			});
		});
		//	删除用户
		$(document).on('tap', '.userItem .mui-icon-trash', function() {
			var postID = $(this).attr("key");
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/users");
			mui.confirm('确认要删除该用户吗？', '', btnArray, function(e) {
				//					回调方法内容
				if(e.index == 1) {
					ref.child(postID).remove();
					console.log("用户" + postID + "删除成功");
				}
			});
		});
		//	编辑用户
		$(document).on('tap', '.userItem .mui-icon-compose', function() {
			var postID = $(this).attr("key");
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/users/" + postID);
			ref.on('value', function(snapshot) {
				$("#username").val(snapshot.val().userName);
				$("#phone").val(snapshot.val().phone);
				$("#email").val(snapshot.val().email);
				$("#password").val(snapshot.val().password);
				var sureSellerFlag = snapshot.val().sureSeller;
				console.log(sureSellerFlag);
				if(sureSellerFlag == 1) {
					$(".sureSeller").addClass("mui-active");
				} else {
					$(".sureSeller").removeClass("mui-active");
				}
				var managerFlag = snapshot.val().manager;
				if(managerFlag == 1) {
					$(".manager").addClass("mui-active");
				} else {
					$(".manager").removeClass("mui-active");
				}
			});
			$("#userUpdate").fadeIn('fast');

			$("#gitMsg").on('tap', function() {
				var username = $("#username").val();
				var phone = $("#phone").val();
				var email = $("#email").val();
				var password = $("#password").val();
				var sureSeller = 0;
				var manager = 0;
				if($("#sex li:first-of-type").hasClass("mui-selected")) {
					var sex = "男";
				} else {
					sex = "女";
				}
				if($(".sureSeller").hasClass("mui-active")) {
					sureSeller = 1;
					console.log("该商家通过认证");
				}
				if($(".manager").hasClass("mui-active")) {
					manager = 1;
					console.log("该用户是管理员");
				}
				console.log(sureSeller);
				if($.trim(username).length == 0 ||
					$.trim(phone).length == 0 ||
					$.trim(email).length == 0 ||
					$.trim(password).length == 0) {
					mui.alert("您还有未输入的信息");
					return;
				}

				var isSign = 0;
				//		for(i in usersArr) {
				//			if(username == usersArr[i].userName) {
				//				mui.alert("该用户名已经有人使用！");
				//				isSign = 1;
				//				break;
				//			}
				//			if(phone == usersArr[i].phone) {
				//				mui.alert("该手机已经注册过！");
				//				isSign = 1;
				//				break;
				//			}
				//
				//			if(email == usersArr[i].email) {
				//				mui.alert("该邮箱已经注册过！");
				//				isSign = 1;
				//				break;
				//			}
				//		}

				if(isSign == 1) {
					return;
				}
				ref.update({
					"userName": username,
					"phone": phone,
					"email": email,
					"password": password,
					"sex": sex,
					"score": 10,
					"manager": manager,
					"sureSeller": sureSeller
				});

				setStorage("manager", manager);
				mui.alert("修改成功", function() {
					$("#userUpdate").fadeOut('fast');
				});
			});
		});
		//  编辑商家
		$(document).on('tap', '.salerItem .manager', function() {
			var salerKey = $(this).attr("key");
			setStorage("salerKey", salerKey);			
			setStorage('Entrance','manager');
			window.location.href = 'salerManager.html';
		});
		//	删除建议
		$(document).on('tap', '.sugItem .mui-icon-trash', function() {
			var postID = $(this).attr("key");
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/suggests");
			mui.confirm('确认要删除该意见吗？', '', btnArray, function(e) {
				//					回调方法内容
				if(e.index == 1) {
					ref.child(postID).remove();
					console.log("意见" + postID + "删除成功");
				}
			});
		});
		//	查看建议
		$(document).on('tap', '.sugItem .mui-icon-search', function() {
			var postID = $(this).attr("key");
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/suggests/" + postID);
			ref.once('value', function(snap) {
				mui.alert(snap.val().content);
			});
		});
		//	删除卖家书籍
		$(document).on('tap', '.saleItem .mui-icon-trash', function() {
			var postID = $(this).attr("key");
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/sale");
			mui.confirm('确认要删除这本书吗？', '', btnArray, function(e) {
				//					回调方法内容
				if(e.index == 1) {
					ref.child(postID).remove();
				}
			})
		});
		//	编辑卖家书籍
		$(document).on('tap', '.saleItem .mui-icon-compose', function() {
			var postID = $(this).attr("key");
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/sale/" + postID);
			ref.on('value', function(snapshot) {
				$("#bookName").val(snapshot.val().bookName);
				$("#author").val(snapshot.val().author);
				$("#from").val(snapshot.val().from);
				$("#msg").val(snapshot.val().msg);
				$("#classIs").val(snapshot.val().Class);
				$("#imgUrl").val(snapshot.val().imgUrl);
				$("#price").val(snapshot.val().price);
				$("#bookUpdate").fadeIn('fast');
			});
			$("#gitMsg").on('tap', function() {
				var bookid = $("#bookID").val();
				var bookname = $("#bookName").val();
				var author = $("#author").val();
				var from = $("#from").val();
				var classIs = $("#classIs").val();
				var msg = $("#msg").val();
				var imgUrl = $("#imgUrl").val();

				if($.trim(bookname).length == 0 ||
					$.trim(author).length == 0 ||
					$.trim(from).length == 0 ||
					$.trim(classIs).length == 0 ||
					$.trim(msg).length == 0 ||
					$.trim(imgUrl).length == 0) {
					mui.alert("您还有未输入的信息");
					return;
				}

				ref.update({
					"bookName": bookname,
					"author": author,
					"from": from,
					"Class": classIs,
					"msg": msg,
					"imgUrl": imgUrl
				});
				mui.alert("修改成功", function() {
					$("#bookUpdate").fadeOut('fast');
				});
			});
		});

	})

	$("#cancle").on('tap', function() {
		$("#userUpdate").fadeOut();
	});
	$("#cancle").on('tap', function() {
		$("#bookUpdate").fadeOut();
	});

	$(".backManager li:first-of-type a").on('tap', function() {
		if(getStorageNow('manager') == 1) {
			window.location.href = 'bookManager.html';
		} else {
			mui.alert('您没有权限进入');
		}
	});
	$(".backManager li:nth-of-type(2) a").on('tap', function() {
		if(getStorageNow('manager') == 1) {
			window.location.href = 'user.html';
		} else {
			mui.alert('您没有权限进入');
		}
	});
	$(".backManager li:nth-of-type(3) a").on('tap', function() {
		if(getStorageNow('manager') == 1) {
			window.location.href = 'allSalerManager.html';
		} else {
			mui.alert('您没有权限进入');
		}
	});
	$(".backManager li:nth-of-type(4) a").on('tap', function() {
		if(getStorageNow('manager') == 1) {
			window.location.href = 'suggestManager.html';
		} else {
			mui.alert('您没有权限进入');
		}
	});
	$(".backManager:nth-of-type(2) li").on('tap', function() {
		setStorage('Entrance','saler');
		window.location.href = 'salerManager.html';
	});

	window.gitBookMsg = gitBookMsg;
})