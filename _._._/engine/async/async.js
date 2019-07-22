var Async = {
	newHash: (function(){var x = 0; return function(){return x++;};})()
}

var Workers = {
	get FUNCTION(){
		return new Worker(__("async/workers/function_worker.js"));
	},
	get MENO(){
		return new Worker(__("async/workers/parser_worker.js"));
	}
}

importScript(__("async/lib/asynctask.js"));

importScript(__("async/lib/asyncfunction.js"));

importScript(__("async/lib/asyncparse.js"));

importScript(__("async/lib/workerpool.js"));

importScript(__("async/lib/future.js"));

importScript(__("async/lib/futurepool.js"));

importScript(__("async/lib/process.js"));


var Parsing = new WorkerPool(__("async/workers/parser_worker.js"),6);