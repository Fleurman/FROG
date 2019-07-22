importScripts('/_._._/scripts/meno/meno.frog.js');

meno.base.img = "/_._._/images/";

onmessage = function(e){
	var o = e.data;
	var result = meno.parsed(o.raw);
	postMessage({hash:o.hash,result:result});
}