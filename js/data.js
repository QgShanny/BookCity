var jsonStr; //书籍的json数据
var booksArr = [];
var boyArr = [];
var girlArr = [];
var ref = new Wilddog("https://bookcity2017.wilddogio.com/Books");

//once 只读取一次
ref.once("value", function(snapshot) {
	var jsonStr = snapshot.val();
	for(i in jsonStr) {
		booksArr.push(jsonStr[i]);
	}

	
	for(i in booksArr) {
		//男频推荐内容类别
		if(booksArr[i].Class == "男生") {
			boyArr.push(booksArr[i]);
		}
		if(booksArr[i].Class == "女生"){
			girlArr.push(booksArr[i]);
		}
	}
	
	//把男生书本插入列表里面
	for(i in boyArr){
		var li = "<li class='mui-table-view-cell'><a class='mui-navigate-right'>" + boyArr[i].BookName + "</a></li>";
		$("<li class='mui-table-view-cell'><a class='mui-navigate-right'>" + boyArr[i].BookName + "</a></li>").appendTo($("#boyTui ul:nth-of-type(2)"));
	}
	//把女生书本插入列表里面
	for(i in girlArr){
		var li = "<li class='mui-table-view-cell'><a class='mui-navigate-right'>" + girlArr[i].BookName + "</a></li>";
		$("<li class='mui-table-view-cell'><a class='mui-navigate-right'>" + girlArr[i].BookName + "</a></li>").appendTo($("#girlTui ul:nth-of-type(2)"));
	}	


//	for(i in boyArr) {
//		if(i == (boyArr.length - 1)) {
//			boyJson += '{"BookName":"' + boyArr[i].BookName + '"}';
//		} else {
//			boyJson += '{"BookName":"' + boyArr[i].BookName + '"},';
//		}
//	}

//	boyJson = "[" + boyJson + "]";
//	boyJson = JSON.parse(boyJson);

});


var jsonUserStr; //用户的json数据  公用
var usersArr = [];

var ref = new Wilddog("https://bookcity2017.wilddogio.com/Users");

//on 有变化就读取
ref.on("value", function(snapshot) {
	var jsonUserStr = snapshot.val();
	for(i in jsonUserStr) {
		usersArr.push(jsonUserStr[i]);
	}
});
