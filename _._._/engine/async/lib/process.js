/*************************************************************

						Async > Process

	new Process(task)
		
			.done(function(data))	Function to execute with the
									Worker's message 'data'
									
			.last()					Terminates the Worker after
									this Task.
			
			.worker(Worker)			Sets the Worker for this task
			.start()				Executes this Process Task
			 or
			.queue(QueuedWorker)	Queue this Task on the Worker
			.startAll()				Executes all queued Tasks on
									this Worker
			

*************************************************************/
 
var Process = function(task){
	//log("PROCESS");
	var worker = null;
	var hash = task.hash;
	var last = false;
	this.worker = function(w){
		worker = w;
		if(w instanceof Worker){
			this.start = doStart;
			this.pool = undefined;
			this.worker = undefined;
			this.last = function(){
				last = true;
				return this;
			};
			this.done = function(fn){
				worker.functions = (worker.functions || {});
				worker.functions[task.hash] = fn;
				return this;
			};
			return this;
		}else{
			throw new Error("Process worker must be a Worker");
		}
	};
	this.pool = function(w){
		if(w instanceof WorkerPool){
			worker = w;
			this.startAll = doStartAll;
			this.pool = undefined;
			this.worker = undefined;
			this.last = function(){
				worker.last = true;
				return this;
			};
			this.start = function(){
				//log("START");
				initPool();
				worker.startOne(hash);
			};
			this.done = function(fn){
				worker.functions = (worker.functions || {});
				worker.functions[task.hash] = fn;
				return this;
			};
			worker.postMessage(new MessageEvent('worker', {data : task}));
			
				//log("POOL");
			return this;
		}else{
			throw new Error("Process pool must be a WorkerPool");
		}
	};
	var initPool = function(){
		if(worker==null){
			console.warn("The process "+task+" has no Worker !");
			return;
		};
		let fn = function(e){
			let msg = e.data;
			//log("RECEIVED",msg.hash);
			doFunction(msg.hash,msg.result)
		};
		if(!worker.event){
			worker.addEventListener("message",fn);
			worker.event = true;
		}
	}
	var doStartAll = function(){
		initPool();
		worker.startAll();
	};
	var doStart = function(){
		if(worker==null){
			console.warn("The process "+task+" has no Worker !");
			return;
		};
		let fut = new Future();
		worker.postMessage(task);
		let fn = function(e){
			let msg = e.data;
			//log("RECEIVED",msg.hash);
			fut.value = msg.result;
			doFunction(msg.hash,msg.result)
			if(worker.last==true){
				worker.terminate();
			};
		};
		if(!worker.event){
			worker.addEventListener("message",fn);
			worker.event = true;
		}
		return fut;
	}
	var doFunction = function(key,msg){
		worker.functions[key](msg);
		//worker.functions[key] = undefined;
	};
}

var pool = new WorkerPool(__("async/workers/function_worker.js"),2);

/* log("Cool");

new Process(new AsyncFunction(function(x){
		for(var i = 0; i<99999999; i++){}
		return x*1;
	},1))
	.pool(pool)
	.done(function(v){log(1,v);});
	
new Process(new AsyncFunction(function(x){return x*11;},2))
	.pool(pool)
	.done(function(v){log(2,v);});
	
new Process(new AsyncFunction(function(x){return x*111;},3))
	.pool(pool)
	.done(function(v){log(3,v);});
	
new Process(new AsyncFunction(function(x){return x*1111;},4))
	.pool(pool)
	.done(function(v){log(4,v);});
	
new Process(new AsyncFunction(function(x){return x*11111;},5))
	.pool(pool)
	.done(function(v){log(5,v);})
	.last()
	.startAll();
	
log("Cool"); */


/* var work = new Worker(__("async/workers/function_worker.js"));

log("Cool");

new Process(new AsyncFunction(function(x){return x*1;},1))
	.worker(work)
	.done(function(v){log(v);})
	.last()
	.start();
new Process(new AsyncFunction(function(x){return x*11;},2))
	.worker(work)
	.done(function(v){log(v);})
	.last()
	.start();
new Process(new AsyncFunction(function(x){
		for(var i = 0; i<999999999; i++){}
		return x*111;
	},3))
	.worker(work)
	.done(function(v){log(v);})
	.last()
	.start();
new Process(new AsyncFunction(function(x){return x*1111;},4))
	.worker(work)
	.done(function(v){log(v);})
	.last()
	.start();
new Process(new AsyncFunction(function(x){return x*11111;},5))
	.worker(work)
	.done(function(v){log(v);})
	.last()
	.start();

log("Cool"); */


/* log("Cool");

new Process(new AsyncFunction(function(x){return x*1;},1))
	.worker(new Worker(__("async/workers/function_worker.js")))
	.done(function(v){log(v);})
	.last()
	.start();
new Process(new AsyncFunction(function(x){return x*11;},2))
	.worker(new Worker(__("async/workers/function_worker.js")))
	.done(function(v){log(v);})
	.last()
	.start();
new Process(new AsyncFunction(function(x){
		for(var i = 0; i<999999999; i++){}
		return x*111;
	},3))
	.worker(new Worker(__("async/workers/function_worker.js")))
	.done(function(v){log(v);})
	.last()
	.start();
new Process(new AsyncFunction(function(x){return x*1111;},4))
	.worker(new Worker(__("async/workers/function_worker.js")))
	.done(function(v){log(v);})
	.last()
	.start();
new Process(new AsyncFunction(function(x){return x*11111;},5))
	.worker(new Worker(__("async/workers/function_worker.js")))
	.done(function(v){log(v);})
	.last()
	.start();

log("Cool"); */


