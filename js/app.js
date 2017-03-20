require.config({
	paths: {
		"jquery": "lib/jquery-1.9.1",
		"mui": "lib/mui.min",
		"localStorage": "localStorage",
		"base": "base",
		"data": "data"
	},
	shim: {
		//no
	}

});
define([
	'jquery',
	'mui',
	'localStorage',
	'base',
	'data'
], function() {
	//页面的滚动
	mui.init()
	mui.ready(function() {
		mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005
		});
	});

})