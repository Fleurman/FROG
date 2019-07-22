var WorkerPool = function(url,max){
	
	EventListen.call(this);
	
	var _this = this;
	var _inter = [];
	var queue = [];
	var workers = [];
	var todo;
	max = max > 0 ? max : 0;
	
	this.last = false;
	
	this.hasWork = function(){
		return !(todo == 0);
	}
	
	this.terminate = function(){
		clearInterval(_inter);
		for(let i = 0; i<workers.length; i++){
			workers[i].o.terminate();
		}
	}
	
	this.postMessage = function(e){
		var o = e.data;
		queue.push(o);
	}
	
	var newWorker = function(){
		let worker = {free:true, o:new Worker(url)};
		let fn = function(e){
			let msg = e.data;
			worker.free = true;
			gotMessage.call(_this,msg);
			if(max==0){
				worker.o.terminate();
			};
		};
		if(!worker.event){
			worker.o.addEventListener("message",fn);
			worker.event = true;
		}
		return worker;
	}
	
	var getWorker = function(){
		if(max==0 || workers.length<max){
			let w = newWorker();
			workers.push(w);
			return w;
		}else{
			let f = new Future();
			let interId = _inter.length;
			var fn = function(){
				for(let i = 0; i<workers.length; i++){
					if(workers[i].free == true){
						f.value = workers[i];
						workers[i].free = false;
						clearInterval(_inter[interId]);
						return;
					}
				}
			};
			_inter.push(setInterval(fn,10));
			return f;
		}
	};
	
	var gotMessage = function(msg){
		this.fireEvent("message",new MessageEvent('worker', {data : msg}));
		todo--;
		if(this.last && todo == 0){
			this.terminate();
		}
	};
	
	var start = function(task){
		let worker = getWorker();
		if(worker instanceof Future){
			worker.echo(function(w){
				w.free = false;
				w.o.postMessage(task);
			});
		}else{
			worker.free = false;
			worker.o.postMessage(task);
		}
	};
	
	this.startAll = function(){
		todo = queue.length;
		for(let i = 0; i<queue.length; i++){
			start(queue[i]);
		}
	};
	
	this.startOne = function(hash){
		todo = queue.length;
		for(let i = 0; i<queue.length; i++){
			//log(queue[i].hash,hash);
			if(queue[i].hash == hash){
				start(queue[i]);
			}
		}
	};
	
}
