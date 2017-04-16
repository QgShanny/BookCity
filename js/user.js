require.config({
	paths: {
		"jquery": "lib/jquery-1.9.1",
		"mui": "lib/mui.min",
		"localStorage": "localStorage",
		"data": "data",
		"picker": "lib/mui.picker.min",
		"poppicker": "lib/mui.poppicker",
		"city": "lib/city.data-3",
	},
	shim: {
		//no
		"picker": ["mui"],
		"poppicker": ["mui"],
		"city": ["mui"]
	}

});
define([
	'jquery',
	'mui',
	'localStorage',
	'data',
	"picker",
	"poppicker",
	"city"
], function() {
	var btnArray = ['取消', '确定'];
	//	我的收藏
	for(var i = 0; i < 2; i++) {
		(function() {
			var p = i + 1;
			$("#allCollect li:nth-of-type(" + p + ")").on('tap', function() {
				$("#allCollect li:nth-of-type(" + p + ")").css("border-bottom", "solid #23a3d5 2px");
				$("#allCollect li:nth-of-type(" + p + ")").siblings().css("border-bottom", "none");
				if(p == 1) {
					$(".storeCollect").css("display", "none");
					$(".bookCollect").css("display", "block");
				} else {
					$(".bookCollect").css("display", "none");
					$(".storeCollect").css("display", "block");
				}
			});
		})()
	}
	var refCollect = new Wilddog("https://bookcity2017.wilddogio.com/users/" + getStorageNow("userKey") + "/collectionbook");
	refCollect.on('value', function(snap) {
		$(".bookCollect .mui-table-view-cell").remove();
		var jsonStr = snap.val(); //收藏的书籍
		for(i in jsonStr) {
			var bookKey = jsonStr[i].bookKey;
			var book = new Wilddog("https://bookcity2017.wilddogio.com/books/" + bookKey);
			book.on('value', function(snap) {
				var bookJson = snap.val();
				var bookList = '<li collectKey="' + i + '" class="mui-table-view-cell">' +
					'<div class="mui-slider-left mui-disabled">' +
					'<a class="mui-btn mui-btn-grey mui-icon mui-icon mui-icon-more" msg=' + bookJson.msg + '></a>' +
					'<a class="mui-btn mui-btn-red mui-icon mui-icon mui-icon-trash"></a>' +
					'</div>' +
					'<div class="mui-slider-right mui-disabled">' +
					'<a class="mui-btn mui-btn-grey mui-icon mui-icon mui-icon-more" msg=' + bookJson.msg + '></a>' +
					'<a class="mui-btn mui-btn-red mui-icon mui-icon mui-icon-trash"></a></div>' +
					'<div class="mui-slider-handle">' + bookJson.bookName + '</div>' +
					'</li>';
				$(bookList).appendTo($(".bookCollect"));
			})
		}
	});

	$(document).on('tap', '.bookCollect .mui-icon-more', function() {
		mui.alert($(this).attr("msg"));
	});

	$(document).on('tap', '.bookCollect .mui-icon-trash', function() {
		var removeKey = $(this).parent().parent().attr("collectKey");
		mui.confirm('确认要删除这本书吗？', '', btnArray, function(e) {
			if(e.index == 1) {
				var ref = new Wilddog("https://bookcity2017.wilddogio.com/users/" + getStorageNow("userKey") + "/collectionbook/");
				console.log(removeKey);
				ref.child(removeKey).remove();
			}
		})

	});

	var refCollectStore = new Wilddog("https://bookcity2017.wilddogio.com/users/" + getStorageNow("userKey") + "/collectionStore");
	refCollectStore.on('value', function(snap) {
		$(".storeCollect .mui-table-view-cell").remove();
		var jsonStr = snap.val(); //收藏的书店
		for(i in jsonStr) {
			var storeKey = jsonStr[i].storeKey;
			var store = new Wilddog("https://bookcity2017.wilddogio.com/users/" + storeKey);
			store.once('value', function(snap) {
				var storeJson = snap.val();
				var storeList = '<li collectKey="' + i + '" class="mui-table-view-cell">' +
					'<div class="mui-slider-left mui-disabled">' +
					'<a class="mui-btn mui-btn-grey mui-icon mui-icon mui-icon-more" storeExplain=' + storeJson.explain + '></a>' +
					'<a class="mui-btn mui-btn-red mui-icon mui-icon mui-icon-trash"></a>' +
					'</div>' +
					'<div class="mui-slider-right mui-disabled">' +
					'<a class="mui-btn mui-btn-grey mui-icon mui-icon mui-icon-more" storeExplain=' + storeJson.explain + '></a>' +
					'<a class="mui-btn mui-btn-red mui-icon mui-icon mui-icon-trash"></a></div>' +
					'<div class="mui-slider-handle">' + storeJson.storeName + '</div>' +
					'</li>';
				$(storeList).appendTo($(".storeCollect"));
			})
		}
	});

	$(document).on('tap', '.storeCollect .mui-icon-more', function() {
		mui.alert($(this).attr("storeExplain"));
	});
	$(document).on('tap', '.storeCollect .mui-icon-trash', function() {
		var removeKey = $(this).parent().parent().attr("collectKey");
		mui.confirm('确认要删除这家店吗？', '', btnArray, function(e) {
			if(e.index == 1) {
				var ref = new Wilddog("https://bookcity2017.wilddogio.com/users/" + getStorageNow("userKey") + "/collectionStore");
				ref.child(removeKey).remove();
			}
		})

	});
	var key = getStorageNow("userKey");
	console.log("当前用户的key是" + key);
	var ref = new Wilddog("https://bookcity2017.wilddogio.com/users/" + key);
	ref.on('value', function(sanp) {
		console.log("有信息变动");
		var jsonStr = sanp.val();
		$("#userName").text(jsonStr.userName);
		$("#phone").text(jsonStr.phone);
		$("#sex").text(jsonStr.sex);
		$("#email").text(jsonStr.email);

		if(getStorageNow("userHead") == null) {
			var sex = jsonStr.sex;
			if(sex == "女") {
				$("#picture img").attr("src", "../../img/girl.jpg");
			} else {
				$("#picture img").attr("src", "../../img/boy.jpg");
			}
		} else {
			$("#picture img").attr("src", getStorageNow("userHead"));
		}

		if(jsonStr.seller == 0 && jsonStr.sureSeller == null) {
			$("#isSaler").text("否");
		}
		if(jsonStr.seller == 1 && jsonStr.sureSeller == null) {
			$("#isSaler").text("审核中");
		}
		if(jsonStr.seller == 1 && jsonStr.sureSeller == 0) {
			$("#isSaler").text("审核不通过");
		}
		if(jsonStr.sureSeller == 1) {
			$("#isSaler").text("是");
		}

		if(jsonStr.birthDay == null) {
			$("#birthDay").text("还未设置");
		} else {
			$("#birthDay").text(jsonStr.birthDay);
		}

		if(jsonStr.address == null) {
			$("#address").text("还未设置");
		} else {
			$("#address").text(jsonStr.address);
		}

		$("#isSaler").on('tap', function() {
			if(jsonStr.seller == 0 && jsonStr.sureSeller == null) {
				mui.confirm('你想申请为商家吗？', '', btnArray, function(e) {
					if(e.index) {
						ref.update({
							seller: 1
						});
						mui.prompt('请输入你的店名：', '', '', btnArray, function(e) {
							if(e.index == 1) {
								if($.trim(e.value).length == 0) {
									mui.alert("请正确输入店名");
								} else {
									ref.update({
										"storeName": e.value,
										"explain": "店家还没有描述自己的店哦~"
									});
								}
							}
						});
						$("#isSaler").text("审核中");
					}
				});
			}
			if(jsonStr.seller == 1 && jsonStr.sureSeller == null) {
				mui.confirm('正在审核中，是否取消申请？', '', btnArray, function(e) {
					if(e.index) {
						ref.update({
							seller: 0
						});
						$("#isSaler").text("否");
					}
				});
			}
			if(jsonStr.seller == 1 && jsonStr.sureSeller == 0) {
				mui.alert("您的申请不通过，可尝试通过意见反馈与管理员联系");
			}
			if(jsonStr.sureSeller == 1) {
				mui.alert("您已经为商家，可进入后台管理，编辑书籍");
			}
		});
	})

	$("#picture").on('tap', function() {
		$("#userPic").click();
		$("#userPic").change(function() {
			startChange();
		});

	});
	$("#userName").on('tap', function() {
		mui.prompt('请输入你的新名字：', '', '', btnArray, function(e) {
			if(e.index == 1) {
				if($.trim(e.value).length == 0) {
					mui.alert("请正确输入用户名");
				} else {
					$("#userName").text(e.value);
					ref.update({
						userName: e.value
					});
					mui.toast("用户名修改成功");
				}
			}
		})
	});

	$("#phone").on('tap', function() {
		mui.prompt('请输入你的新手机号码：', '', '', btnArray, function(e) {
			if(e.index == 1) {
				if($.trim(e.value).length == 0) {
					mui.alert("请正确输入手机号码");
				} else {
					$("#phone").text(e.value);
					ref.update({
						phone: e.value
					});
					mui.toast("手机修改成功");
				}
			}
		})
	});

	$("#email").on('tap', function() {
		mui.prompt('请输入你的新邮箱：', '', '', btnArray, function(e) {
			if(e.index == 1) {
				if($.trim(e.value).length == 0) {
					mui.alert("请正确输入邮箱");
				} else {
					$("#email").text(e.value);
					ref.update({
						email: e.value
					});
					mui.toast("邮箱修改成功");
				}
			}
		})
	});

	$("#password").on('tap', function() {
			mui.prompt('请输入你的新密码：', '', '', btnArray, function(e) {
				if(e.index == 1) {
					if($.trim(e.value).length == 0) {
						mui.alert("请输入正确格式的密码");
					} else {
						mui.prompt('请输入确认密码：', '', '', btnArray, function(e) {
							if(e.index == 1) {
								if($.trim(e.value).length == 0) {
									mui.alert("两次密码不一致");
								} else {
									ref.update({
										password: e.value
									});
									mui.toast("密码修改成功");
								}
							}
						});
					}
				}
			});
		})
		/*图片转码函数*/
	function startChange() {
		var img = document.getElementById('userPic');
		var imgFile = new FileReader();
		imgFile.readAsDataURL(img.files[0]); //从input，file里读取文件
		imgFile.onload = function() {
			var imgData = this.result; //base64数据    
			$("#picture img").attr('src', imgData);
			var ref = new Wilddog("https://bookcity2017.wilddogio.com/users/" + getStorageNow("userKey"));
			ref.update({
				userHead: imgData
			});
			console.log("图片长度为：" + imgData.length);
		}
		$("#userPic").val();
	}

	if($('body').find($("#birthDay")).length == 0) {
		return;
	}
	(function($, doc) {
		$.init();
		/*---shengri*/
		var shengri = document.getElementById("birthDay");
		shengri.addEventListener('tap', function() {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var picker = new $.DtPicker(options);
			picker.show(function(rs) {
				$("#birthDay").innerTexttext = rs.text;
				ref.update({
					birthDay: rs.text
				})
				picker.dispose();
			});
		}, false);

		$.ready(function() {
			var userPicker = new $.PopPicker();
			userPicker.setData([{
				value: 1,
				text: '男'
			}, {
				value: 2,
				text: '女'
			}]);
			var showUserPickerButton = doc.getElementById('sex');
			var userResult = doc.getElementById('sex');
			showUserPickerButton.addEventListener('tap', function(event) {
				userPicker.show(function(items) {
					if(JSON.stringify(items[0].value) == 1)
						var sex = "男";
					else
						var sex = "女";
					userResult.innerText = sex;
					ref.update({
						sex: sex
					})
				});
			}, false);
			//三级联示例
			var cityPicker3 = new $.PopPicker({
				layer: 3
			});
			cityPicker3.setData(cityData3);
			var showCityPickerButton = doc.getElementById('address');
			var cityResult3 = doc.getElementById('address');
			showCityPickerButton.addEventListener('tap', function(event) {
				cityPicker3.show(function(items) {
					var temp = (items[2] || {}).text;
					if(typeof(temp) == 'undefined') {
						temp = "";
					}
					var result = (items[0] || {}).text + " " + (items[1] || {}).text + " " + temp;
					cityResult3.innerText = result;
					ref.update({
						address: result
					});
				});
			}, false);
		});

	})(mui, document);



	$(".back").on('tap', function() {
		window.location.href = "../index.html";
	});

})