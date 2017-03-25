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
	
	var ref = new Wilddog("https://bookcity2017.wilddogio.com");
	function gitBookMsg() {
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

		var postsRef = ref.child("Books");

		postsRef.push({
			"BookId": bookid,
			"BookName": bookname,
			"Author": author,
			"from": from,
			"Class": classIs,
			"Msg": msg,
			"imgUrl": imgUrl
		});

		mui.alert("书籍插入成功");
	}
	
//	之前优化,公用数据
	var ref = new Wilddog("https://bookcity2017.wilddogio.com/Books");
	//once 只读取一次
	ref.once("value", function(snapshot) {
		var jsonStr = snapshot.val();
		var booksArr = [];
		var bookList = "";
		for(i in jsonStr) {
			booksArr.push(jsonStr[i]);
		}
     
		for(i in booksArr) {
			bookList += "<tr><td>" + booksArr[i].BookId + "</td><td>" + booksArr[i].BookName + "</td><td>" + booksArr[i].Author + "</td><td><i class='mui-icon mui-icon-trash'></i><i class='mui-icon mui-icon-compose'></i></td></tr>";
		}
		$(bookList).appendTo($("#allBookList"));
	});
	
	var ref = new Wilddog("https://bookcity2017.wilddogio.com/Users");
	//once 只读取一次
	ref.once("value", function(snapshot) {
		var jsonStr = snapshot.val();
		var usersArr = [];
		var userList = "";
		for(i in jsonStr) {
			usersArr.push(jsonStr[i]);
		}
     
		for(i in usersArr) {
			userList += "<tr><td>" + usersArr[i].UserName + "</td><td>" + usersArr[i].Sex + "</td><td>" + usersArr[i].Phone + "</td><td><i class='mui-icon mui-icon-trash'></i><i class='mui-icon mui-icon-compose'></i></td></tr>";
		}
		$(userList).appendTo($("#allUserList"));
	});
	
	$("#addBook").on('tap',function(){
		 var signFlag = sign('userId');
		 if(signFlag == 1){
		 	window.location.href = "addBook.html";
		 }
	});
	
	$("#addUser").on('tap',function(){
		 var signFlag = sign('userId');
		 if(signFlag == 1){
		 	window.location.href = "../regist.html";
		 }
	});
	
	window.gitBookMsg = gitBookMsg;
})