var getJson = function(url,syn){
	var req = Request(url,syn);
	req.processResponse = function(res){
		return JSON.parse(res.responseText);
	};
	return req;
};

var getText = function(url,syn){
	var req = Request(url,syn);
	req.processResponse = function(res){
		return res.responseText;
	};
	return req;
};