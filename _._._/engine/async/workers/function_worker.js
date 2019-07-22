onmessage = function(e){
	var o = e.data;
	var fn;
	eval("fn = " + o.task +";");
	var kol = fn.apply(null,o.args);
	postMessage({hash:o.hash,result:kol});
}