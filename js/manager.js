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
	
	
	
//	var ref = new Wilddog("https://bookcity2017.wilddogio.com/Books");
//	ref.once("value", function(snapshot) {
//		var bookJson = snapshot.val();
//		var book = [];
//		for(i in bookJson) {
//			book.push(bookJson[i]);
//		}
//		console.log(book);
//	});
//	
//	var books = function($scope,book){
//		$scope.book = book;
//	}	
//	var bookList = "<tr ng-repeat='"+ item in book+ "'><td>"+book.BookId+"</td><td>"+book.BookName+"</td><td>"+book.Author+"</td><td>删除</td></tr>";
	

	
	window.gitBookMsg = gitBookMsg;
})