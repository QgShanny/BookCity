require.config({
	paths: {
		"jquery": "lib/jquery-1.9.1",
		"localStorage": "localStorage",
		"lazyload" : "lib/jquery.lazyload.min"
	},
	shim: {
		"lazyload": ['jquery']
	}

});
define(['jquery', 'localStorage','lazyload'], function() {
	
	var ref = new Wilddog("https://bookcity2017.wilddogio.com/books");
	ref.on('value',function(sanp){
		var jsonStr = sanp.val();
		for(i in jsonStr){
			var temp = '<li>'+
							'<img class="lazy" src="'+jsonStr[i].imgUrl+'"/>'+
							'<div>'+
								'<h5>'+jsonStr[i].bookName+'</h5>'+
								'<p>'+jsonStr[i].author+'</p>'+
								'<p>'+jsonStr[i].from+'</p>'+
							'</div>'+
						'</li><div class="clearfix"></div>';
		    $(temp).appendTo($(".allBooksList"));
		}
	});
	
		
			$(function() {
				$("img.lazy").lazyload({
					effect: "fadeIn"
				});
			});
})