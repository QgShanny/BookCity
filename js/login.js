var jsonStr; //用户的json数据
var usersArr = [];

var ref = new Wilddog("https://bookcity2017.wilddogio.com/Users");

//on 有变化就读取
ref.on("value", function(snapshot) {
	var jsonStr = snapshot.val();
	for(i in jsonStr) {
		usersArr.push(jsonStr[i]);
	}

//	console.log(usersArr);

});
$("#login").click(function(){
	var phone = $.trim($("#phone").val());
	var password = $.trim($("#password").val());
	if(phone.length == 0 || password.length == 0){
		alert("请输入正确的用户名和密码");
		return;
	}
//	console.log(usersArr[0].Phone);
//	console.log(usersArr[0].Password);
	var status = 0;
	for(i in usersArr){
		console.log(usersArr[i].Phone+"  " + usersArr[i].Password);
		if(phone == usersArr[i].Phone && password == usersArr[i].Password){
			window.location.href = "index.html";
			status = 1;
			setStorage("userId",usersArr[i].Phone);
			setStorage("userName",usersArr[i].UserName);
			break;
		}
	}
	if(status == 0){
		alert("用户名或密码错误");
	}
});

$("#cancle").click(function(){
	window.location.href = "index.html";
})