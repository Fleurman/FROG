var AsyncFunction = function(fn,...args){
	this.task = fn.toString();
	this.args = (args || []);
	this.hash = Async.newHash();
};