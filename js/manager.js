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

	function gitBookMsg() {
		var manageFlag = getStorageNow("manager");
		if(manageFlag == 1) {
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/books");
		} else {
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/sale");
		}
		var bookid = $("#bookID").val();
		var bookname = $("#bookName").val();
		var author = $("#author").val();
		var from = $("#from").val();
		var classIs = $("#classIs").val();
		var msg = $("#Msg").val();
		var imgUrl = $("#imgUrl").val();

		if($.trim(bookid).length == 0 ||
			$.trim(bookname).length == 0 ||
			$.trim(author).length == 0 ||
			$.trim(from).length == 0 ||
			$.trim(classIs).length == 0 ||
			$.trim(msg).length == 0 ||
			$.trim(imgUrl).length == 0) {
			mui.alert("您还有未输入的信息");
			return;
		}
		if(manageFlag == 0) {
			if($.trim($("#price").val()) == 0) {
				mui.alert("您还有未输入的信息");
				return;
			}
		}
		var newref = ref.push({
			"bookId": bookid,
			"bookName": bookname,
			"author": author,
			"from": from,
			"Class": classIs,
			"msg": msg,
			"imgUrl": imgUrl
		});

		var postID = newref.key();
		if(manageFlag == 0) {
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/sale/" + postID);
			ref.update({
				"price": $.trim($("#price").val())
			});
		}
		mui.alert("插入成功", function() {
			if(manageFlag == 1) {
				var ref = new Wilddog("https://bookcity2017.wilddogio.com/books/" + postID);
				console.log("管理员");
			} else {
				var ref = new Wilddog("https://bookcity2017.wilddogio.com/sale/" + postID);
				console.log("卖家" + postID);
			}

			ref.update({
				"key": postID
			});
		});

	}

	// 书籍查询
	var refBook = new Wilddog("https://bookcity2017.wilddogio.com/books");
	//once 只读取一次
	refBook.on("value", function(snapshot) {
		$(".bookItem").remove();
		var jsonStr = snapshot.val();
		console.log("所有书籍" + jsonStr);
		var booksArr = [];
		var bookList = "";
		for(i in jsonStr) {
			booksArr.push(jsonStr[i]);
		}

		for(i in booksArr) {
			bookList += "<tr class='bookItem'><td>" + booksArr[i].bookId + "</td><td>" + booksArr[i].bookName + "</td><td>" + booksArr[i].author + "</td><td><i class='mui-icon mui-icon-trash' key='" + booksArr[i].key + "'></i><i class='mui-icon mui-icon-compose' key='" + booksArr[i].key + "'></i></td></tr>";
		}
		$(bookList).appendTo($("#allBookList"));
	});

	// 用户查询
	var refUser = new Wilddog("https://bookcity2017.wilddogio.com/users");
	//once 只读取一次
	refUser.on("value", function(snapshot) {
		$(".userItem").remove();
		var jsonStr = snapshot.val();
		var usersArr = [];
		var userList = "";
		for(i in jsonStr) {
			usersArr.push(jsonStr[i]);
		}

		for(i in usersArr) {
			if(usersArr[i].manager == 1) {
				var identity = "管理员";
			}
			if(usersArr[i].seller == 1) {
				var identity = "商家";
			}
			if(usersArr[i].manager == 0 && usersArr[i].seller == 0) {
				var identity = "普通";
			}
			console.log(usersArr[i].manager + "  " + identity);
			userList += "<tr class='userItem'><td>" + usersArr[i].userName + "</td><td>" + usersArr[i].sex + "</td><td>" + usersArr[i].phone + "</td><td>" + identity + "</td><td><i class='mui-icon mui-icon-trash' key='" + usersArr[i].key + "'></i><i class='mui-icon mui-icon-compose' key='" + usersArr[i].key + "'></i></td></tr>";
		}
		$(userList).appendTo($("#allUserList"));
	});

	// 卖家书籍查询
	var saleBook = new Wilddog("https://bookcity2017.wilddogio.com/sale");
	//once 只读取一次
	saleBook.on("value", function(snapshot) {
		$(".saleItem").remove();
		var jsonStr = snapshot.val();
		var booksArr = [];
		var bookList = "";
		for(i in jsonStr) {
			booksArr.push(jsonStr[i]);
		}

		for(i in booksArr) {
			bookList += "<tr class='saleItem'><td>" + booksArr[i].bookId + "</td><td>" + booksArr[i].bookName + "</td><td>" + booksArr[i].author + "</td><td>￥" + 1 + "</td><td><i class='mui-icon mui-icon-trash' key='" + booksArr[i].key + "'></i><i class='mui-icon mui-icon-compose' key='" + booksArr[i].key + "'></i></td></tr>";
		}
		$(bookList).appendTo($("#allSaleBookList"));
	});

	// 意见查询
	var refSug = new Wilddog("https://bookcity2017.wilddogio.com/suggests");
	//once 只读取一次
	refSug.on("value", function(snapshot) {
		$(".sugItem").remove();
		var jsonStr = snapshot.val();
		var sugList = "";
		var sugsArr = [];
		var sugList = "";
		for(i in jsonStr) {
			sugsArr.push(jsonStr[i]);
		}

		for(i in sugsArr) {
			sugList += "<tr class='sugItem'><td>" + sugsArr[i].userName + "</td><td>" + sugsArr[i].content + "</td><td>" + sugsArr[i].time + "</td><td><i class='mui-icon mui-icon-trash' key='" + sugsArr[i].key + "'></i></td></tr>";
		}
		$(sugList).appendTo($("#allsugList"));
	});

	$("#addBook").on('tap', function() {
		var signFlag = sign('userId');
		console.log(signFlag);
		if(signFlag == 1) {
			window.location.href = "addBook.html";
		}
	});

	$("#addUser").on('tap', function() {
		var signFlag = sign('userId');
		if(signFlag == 1) {
			window.location.href = "../regist.html";
		}
	});

	$(function() {
		//	删除书籍
		$(document).on('tap', '.bookItem .mui-icon-trash', function() {
			var postID = $(this).attr("key");
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/books");
			console.log(postID);
			var btnArray = ['取消', '确认'];
			mui.confirm('确认要删除这本书吗？', '', btnArray, function(e) {
				//					回调方法内容
				if(e.index == 1) {
					ref.child(postID).remove();
				}
			})
		});
		//	编辑书籍
		$(document).on('tap', '.bookItem .mui-icon-compose', function() {
			var postID = $(this).attr("key");
			console.log(postID);
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/books/" + postID);
			ref.on('value', function(snapshot) {
				$("#bookID").val(snapshot.val().bookId);
				$("#bookName").val(snapshot.val().bookName);
				$("#author").val(snapshot.val().author);
				$("#from").val(snapshot.val().from);
				$("#msg").val(snapshot.val().msg);
				$("#classIs").val(snapshot.val().Class);
				$("#imgUrl").val(snapshot.val().imgUrl);
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

				if($.trim(bookid).length == 0 ||
					$.trim(bookname).length == 0 ||
					$.trim(author).length == 0 ||
					$.trim(from).length == 0 ||
					$.trim(classIs).length == 0 ||
					$.trim(msg).length == 0 ||
					$.trim(imgUrl).length == 0) {
					mui.alert("您还有未输入的信息");
					return;
				}

				ref.update({
					"bookId": bookid,
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
			console.log(postID);
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/users");
			var btnArray = ['取消', '确认'];
			mui.confirm('确认要删除该用户吗？', '', btnArray, function(e) {
				//					回调方法内容
				if(e.index == 1) {
					ref.child(postID).remove();
				}
			})
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
			});
			$("#userUpdate").fadeIn('fast');

			$("#gitMsg").on('tap', function() {
				var username = $("#username").val();
				var phone = $("#phone").val();
				var email = $("#email").val();
				var password = $("#password").val();
				var seller = 0;
				if($("#sex li:first-of-type").hasClass("mui-selected")) {
					var sex = "男";
				} else {
					sex = "女";
				}

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
					"manager": 0,
					"seller": seller
				});

				mui.alert("修改成功", function() {
					$("#userUpdate").fadeOut('fast');
				});
			});
		});
		//	删除卖家书籍
		$(document).on('tap', '.saleItem .mui-icon-trash', function() {
			var postID = $(this).attr("key");
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/sale");
			console.log(postID);
			var btnArray = ['取消', '确认'];
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
			console.log(postID);
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/sale/" + postID);
			ref.on('value', function(snapshot) {
				$("#bookID").val(snapshot.val().bookId);
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

				if($.trim(bookid).length == 0 ||
					$.trim(bookname).length == 0 ||
					$.trim(author).length == 0 ||
					$.trim(from).length == 0 ||
					$.trim(classIs).length == 0 ||
					$.trim(msg).length == 0 ||
					$.trim(imgUrl).length == 0) {
					mui.alert("您还有未输入的信息");
					return;
				}

				ref.update({
					"bookId": bookid,
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
		//	删除建议
		$(document).on('tap', '.sugItem .mui-icon-trash', function() {
			var postID = $(this).attr("key");
			console.log(postID);
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/suggests");
			var btnArray = ['取消', '确认'];
			mui.confirm('确认要删除该用户吗？', '', btnArray, function(e) {
				//					回调方法内容
				if(e.index == 1) {
					ref.child(postID).remove();
				}
			})
		});
	})

	$("#userUpdate").on('tap', function() {
		$("#userUpdate").fadeOut();
	});
	$("#bookUpdate").on('tap', function() {
		$("#bookUpdate").fadeOut();
	});

	window.gitBookMsg = gitBookMsg;
})