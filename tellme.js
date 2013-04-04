var situation = {};
var currentN = 0;

var upKey = function(key,val) {
	situation[key]=val;
	console.log("UPDATE: "+key+"="+val);
}

// handlers update-create variables
Handlebars.registerHelper('up', function(param,val) {
	upKey(param, val ? val : true);
	console.log("UPDATE: "+param+"="+val);
});

// handlers if var does not exist create it true
/*
Handlebars.registerHelper('create', function(key) {
	if ($.inArray(key,Object.keys(situation))==-1) upKey(key,true);
});
*/
		
// handlers make choices
Handlebars.registerHelper('ch', function(options) {
	// if first key does not exist, create it true
	var firstk = Object.keys(options.hash)[0];
	if ($.inArray(firstk,Object.keys(situation))==-1) upKey(firstk,true);

	var unik = "ch_"+firstk;
	var firstruekey = firstk;
		$.each( Object.keys(options.hash), function(i,v) {if(situation[v]==true) firstruekey=v;} );
	var links = (Object.keys(options.hash).map(function(key) {
		var l = '<a href="#" id="'+key+'" class="choice '+unik+'" '
		l+= firstruekey==key ? 'style="display:visible;"' : 'style="display:none;"';
		l+= ' onclick=\'clicOn(".'+unik+'","'+key+'")\'>'+options.hash[key]+'</a>';
		return l;
		})).join(" ");
	return new Handlebars.SafeString(links);
});

// on clic on choice
var clicOn = function(unik,key) {
	event.stopPropagation();

	// activate next one
	var el = null;
	if ($(unik+':visible').next(unik).length != 0) {    
		el = $(unik+':visible').hide().next(unik+':hidden:first');
	} else {
		el = $(unik).hide().eq(0);
	}
	el.show();
	upKey(el.attr("id"),true);
				
	// deactive all situations (except new one)
	$(unik).each(function() {
		var k = $(this).attr("id");
		if(k!=el.attr("id")) upKey(k,false);
	});

	// reload page
	loadTemplate();
};

var loadTemplate = function(newPage) {
	// use templatesource from this file
	//var source = $("#entry-template").html();
	// or load templatesource using ajax
	console.log("... loading AJAX template");
	$.ajax({
       url: "template.htm",
       dataType: 'html',
       cache: true,
       error: function(data) {
      	console.log("error:"+data.status);
       },
       success: function(data) {
       		var parts = $("div",data);
			var part = parts.eq(currentN%parts.length);
			//var template  = Handlebars.compile(data);
			var template  = Handlebars.compile(part.html());
			var html = template(situation).replace(/@/g, "</br>");
			if(newPage) $('#histoire').css("opacity",0);
			$("#cible").html(html);
			if(newPage) $('#histoire').animate({"opacity":1},500);
			$("#photo img").attr("src","images/tm_0"+currentN+".jpg")
/*
			var klist = Object.keys(situation).map(function(key) {
				return '<li><a>' + key + "=" + situation[key] + "</a></li>";
			}).join("");
			$("#keys").html("<ul>"+klist+"</ul>")
*/
       }
   }); 
};

$(document).ready( function() {
	$("body").click( function(e) {
		currentN+=1;
		loadTemplate(true);
	});
	loadTemplate();
});