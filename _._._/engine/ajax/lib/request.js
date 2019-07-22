var Request = function(url,syn){
	syn = (syn || false);
	var ajax = {};
	ajax.req = new XMLHttpRequest();
	ajax.Future = new Future();
	
	ajax.onLoaded = function(){};
	ajax.loaded = function(fn){
		ajax.onLoaded = fn;
		return ajax;
	};
	
	ajax.processResponse = function(res){return res;};
	ajax.req.onload = function(e){
		if (this.status === 200) {
		// if(this.responseText){
			try{
				ajax.Future.value = ajax.processResponse(this);
				ajax.onLoaded(ajax.Future.value);
			}catch(e){
				ajax.onFailed();
			}
		}else{
			// console.error("NO RESPONSE",e,this);
			ajax.onFailed(e);
		}
	};
	
	ajax.onFailed = function(){};
	ajax.failed = function(fn){
		ajax.onFailed = fn;
		return ajax;
	};
	ajax.req.onerror = function(e){
		console.error("Ajax Error " + e.target.status + " from " + url);
		ajax.onFailed(e);
	};
	
	ajax.send = function(){
		ajax.req.open('GET', url, !syn);
		ajax.req.send(null);
		return ajax.Future;
	};
	return ajax;
};

var fhtml = function(raw){
	raw = raw.replace(/</g,"&lt;");
	raw = raw.replace(/>/g,"&gt;");
	return raw;
}