"use strict"

	var FROG = {};
	
	var OPTIONS = {
		FLOWMAX: 0,
		PERPAGE: 100,
		TEMPLATE: 'article-full'
	};
	
	
	Object.defineProperty(FROG,'FLOWS',{
		get: (() =>{
			var id = 0;
			return(()=>id++);
		})()
	});


	var importScript = function(url){
		var req = new XMLHttpRequest();
		req.onload = function(e){
			if(this.responseText.length>0){
				eval.call(window,this.responseText);
			}else{
				throw new Error("Impossible to load script "+ url);
			}
		};
		req.onerror = function(e){
			throw new Error("Impossible to load script "+ url);
		}
		req.open('GET', url, false);
		req.send(null);
	};
	
	
var __ = function(p){
	return "/_._._/engine/"+(p || "");
};

var _s = function(p){
	return "/_._._/styles/frog/"+(p || "");
};

var _i = function(p){
	return "/_._._/images/"+(p || "");
};

var _a = function(p){
	return "/_._._/articles/"+(p || "");
};

var _t = function(p){
	return "/_._._/templates/"+(p || "");
};
var error = console.error;
var warning = console.warn;


if (Element.prototype.getAttributeNames == undefined) {
  Element.prototype.getAttributeNames = function () {
    var attributes = this.attributes;
    var length = attributes.length;
    var result = new Array(length);
    for (var i = 0; i < length; i++) {
      result[i] = attributes[i].name;
    }
    return result;
  };
}

var EventListen = function(){
	this.events = {};
	this.addEventListener = function(ev,fn){
		this.events[ev] = (this.events[ev] || []);
		this.events[ev].push(fn);
	};
	this.removeEventListener = function(ev,fn){
		if(this.events[ev]!==undefined){
			let t = this.events[ev];
			for(let i = 0; i<t.length; i++){
				if(t[i]==fn){
					t.splice(i,1);
					break;
				}
			}
		}
	};
	this.fireEvent = function(ev,o){
		if(this.events[ev]){
			let t = this.events[ev];
			for(let i = 0; i<t.length;i++){
				t[i](o);
			}
		}
	};
};

var hookedProperty = function(fn,key,value) {
    "use strict"
    let prop = value;
    Object.defineProperty(this,key,{
        set: (v)=>{
            prop = v;
            fn(v);
        },
        get:()=>{
            return prop;
        }
    });
};
var immutableProperty = function(key,value) {
    Object.defineProperty(this,key,{
        get:()=>{
            return value;
        }
    });
};

var UrlHash = (()=>{
    var o = {};
    var table = {};
    o.read = () => {
        window.location.hash
            .replace("#","")
            .split("&")
            .forEach(function(e){
                let v = e.split("=");
                if(v[0] && v[1]){
                    let value = decodeURIComponent(v[1]);
                    try {
                        value = JSON.parse(decodeURIComponent(v[1]));
                    } catch (e) {}
                    table[v[0]] = value;
                }
    })};
    o.write = () => {
        let hash = '#';
        let pairs = [];
        Object.keys(table).forEach(key => {
            let value = table[key];
            if(typeof(value) === typeof({})){ value = JSON.stringify(value); }
            pairs.push(key + '=' + encodeURIComponent(value));
        });
        hash += pairs.join('&');
        window.location.hash = hash;
    };
    o.get = (key) => {
        o.read();
        return table[key];
    };
    o.set = (key,value) => {

        if(typeof(key) === typeof({})){
            table = Object.assign(table,key);
        }else{
            table[key] = value;
        }

        o.write();
    };
    Object.defineProperty(o,'list',{
        get:() => {
            let copy = {};
            Object.keys(table).forEach(key => {
                copy[key] = table[key];
            });
            return copy;
        }
    })
    window.addEventListener('load',o.read());
    return o;
})();

var Cache = (()=>{

    var o = {};

    var table = {};

    o.get = (key) => {
        return table[key];
    };

    o.set = (key,value) => {
        table[key] = value;
        addRecord(key,value);
    };

    o.has = (key) => {
        return table[key] ? true : false;
    };

    let load = () => {
        for (let i = 0; i < window.sessionStorage.length; i++) {
            const key = window.sessionStorage.key(i);
            table[key] = window.sessionStorage.getItem(key);
        }
    };
    let addRecord = (key,value) => {
        let i = 0;
        while(true){
            try {
                window.sessionStorage.setItem(key,value);
                break;
            } catch (e) {
                let id = window.sessionStorage.key(i++);
                window.sessionStorage.removeItem(id);
            }
        }
    };

    window.addEventListener('load',load);

    return o;

})();

if (!String.prototype.replaceParams) {
    String.prototype.replaceParams = function() {
        // console.log('REP PARAM',this);
        return this.replace(/(\$([^ ]+))/g,function(s,m,p){
            return UrlHash.get(p) || "";
        });
    };
}

/* var Cache = {};

var inc = 0;
var Test = function Test(name) {
    if(Cache[name]){
        return Cache[name];
    }
    this.name = name;
    this.id = inc++;
    Cache[name] = this;
}; */

/* console.log(new Test('bien').id);
console.log(new Test('nope').id);
console.log(Test('bien').id);
console.log(new Test('bof').id); */


var Sorting = {
    natural: function(a,b){return a.localeCompare(b);},
    reverse: function(a,b){return b.localeCompare(a);},
    random: function(a,b){return Math.random > 0.5 ? -1 : 1;}
};

if (!HTMLElement.prototype.remove) {
  HTMLElement.prototype.remove = function() {
      this.parentElement.removeChild(this);
  };
}
if (!HTMLElement.prototype.replace) {
  HTMLElement.prototype.replace = function(content) {
    this.insertAdjacentHTML('beforebegin',content);
    this.remove();
  };
}
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

var AsyncTask = function(url,name,...args){
	this.url = script;
	this.name = name;
	this.args = args;
	this.hash = Async.newHash();
};

var AsyncFunction = function(fn,...args){
	this.task = fn.toString();
	this.args = (args || []);
	this.hash = Async.newHash();
};

var AsyncParse = function(raw){
	this.raw = raw;
	this.hash = Async.newHash();
};

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

var Future = function(v){
	
	EventListen.call(this);

	var val = v || null;
	
	Object.defineProperty(this, 'value', {
		get() {return val;},
		set(v) {
			this.fireEvent("value",new MessageEvent('future', {data : v}));
			val = v;
			onChanged();
		},
		enumerable: true,
		configurable: true
	});
	
	var setter = function(v){
		val = v;
	}
	
	var echos = [];
	var onChanged = function(){
		for(let i = 0; i < echos.length; i++){
			let r = echos[i](val,setter);
			if(r===false){break;}
			if(typeof(r)===typeof(0)){i=i+r<0?0:i+r;}
		}
	};
	this.echo = function(fn){
		echos = [];
		echos.push(fn);
		let o = {
			then: then.bind(this)
		}
		if(this.value != null){
			onChanged();
		}
		return o;
	}
	
	var then = function(fn){
		echos.push(fn);
		let o = {
			then: then.bind(this)
		}
		if(this.value != null){
			onChanged();
		}
		return o;
	}
};

var FuturePool = function(){
    
    EventListen.call(this);
    
    let count = 0;
    let doneFn = ()=>{};
    let timeout;

    this.add = function(fut){
        if(!(fut instanceof Future)){return;}
        count++;
        fut.addEventListener('value',()=>{
            count--;
            testDone();
        })
        return this;
    };

    this.done = function(fn){
        this.add = ()=>{};
        doneFn = fn;
        testDone.bind(this)();
    };

    let testDone = function(){
        if(count == 0){
            clearTimeout(timeout);
            doneFn();
        }
    }

    this.clearTimeout = function(){
        clearTimeout(timeout);
    };
    this.setTimeout = function(ms,fn,stop=false){
        this.clearTimeout();
        setTimeout(()=>{
            if(stop){doneFn = ()=>{};}
            fn();
        },ms)
        return this;
    };

}

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




var Parsing = new WorkerPool(__("async/workers/parser_worker.js"),6);
var CatalogResult = function(data){
	this.data = (data || []);
	Object.defineProperty(this, "size", 
		{
			get : function(){
				return this.data.length;
			}
		}
	);
	this.forEach = this.data.forEach;
	this.add = function(val){
		if(!this.data[val]){
			this.data.push(val);
		}
	};
	this.merge = function(list){
		list.forEach(this.add.bind(this))
	};
	this.get = function(step, page){
		let s = step*page;
		return this.data.slice(s, s+Number(step));
	};
	this.preload = function(){
		this.forEach(art=>{
			if(!Cache.has(art.path)){
				getText(_a(art.path+".txt")).loaded(function(raw){
					new Process(new AsyncParse(raw))
						.pool(Parsing)
						.done(function(v){
							Cache.set(art.path,v);
						})
						.start();
				}).send();
			}
		});
	};
	this.thenCategory = (query) => {
		if (query == "all"){return;}

		let data = [];
		
		this.data.forEach((art)=>{
			let inc,exc = false;
			if (query.exclude.length>0){
				exc = testExclude(art.categories,query.exclude);
			}else{
				exc = true;
			}
			if (query.include.length>0){
				inc = testInclude(art.categories,query.include);
			}else{
				inc = true;
			}

			if(inc && exc){
				data.push(art);
			}
		})
		
		this.data = data;
	};
	this.thenTags = (query) => {
		let data = [];
		this.data.forEach((art)=>{
			if (query == "all" || 
				testExclude(art.tags,query.exclude) && 
				testInclude(art.tags,query.include)
			){
				data.push(art);
			}
		})
		this.data = data;
	};
	this.thenTitle = (query) => {
		let data = [];
		this.data.forEach((art)=>{
			let w = query.split(" ");
			if( sentenceContains(art.title,w) ){
				data.push(art);
			}
		})
		this.data = data;
	};
	this.thenDate = (query) => {
		let data = [];
		this.data.forEach((art)=>{
			if( testIncorrectDate(art.date,query) ){
				data.push(art);
			}
		})
		this.data = data;
	};
}

var Catalog = {
	date: (function () {
		let d = new Date();
		return Date.parse([d.getFullYear(), d.getMonth(), d.getDate()].join(" "));
	})(),
	getMetaKey: function(key){
		return Catalog.keys[key];
	},
	templates: {}
};

var sentenceContains = function (str, arr) {
	str = str.toLowerCase();
	for (let i = 0; i < arr.length; i++) {
		let w = arr[i].toLowerCase();
		if (str.includes(w)) { return true; }
	}
	return false;
}

var arrayContains = function(a1,a2){
	a1.sort();a2.sort();
	for(let i = 0; i<a1.length; i++){
		for(let j = 0; j<a2.length; j++){
			if(a1[i] && a2[j]){
				if(a1[i]==a2[j]){
					// console.log('CONTAINS TRUE',a1,a2);
					return true;
				}
			}
		}
	}
	// console.log('CONTAINS FALSE',a1,a2);
	return false;
}

var testInclude = function (t1, t2) {
	return arrayContains(t1, t2);
}
var testExclude = function (t1, t2) {
	return !arrayContains(t1, t2);
}

getJson(_a("_catalog.json"), true).loaded(function (data) {
	
	Catalog.title = data.t;
	Catalog.metas = data.m;
	Catalog.keys = data.k;
	Catalog.dated = data.d;
	Catalog.undated = data.u;

	var searchFor = function (test, query) {
		let arts = new CatalogResult();

		let type = (query.state.include && query.state.include.includes('undated')) ? 'undated' : 'dated';

		if (type == 'undated') {
			arts.merge(searchForUndated(test,query));
		}else {
			arts.merge(searchForDated(test,query));
		}

		return arts;
	}
	
	var searchForDated = function (test,query) {
		let years = Object.keys(Catalog.dated).sort(Sorting.reverse);
		let list = [];
		let count = 1;
		for (let y in years) {
			y = years[y];
			let months = Object.keys(Catalog.dated[y]).sort(Sorting.reverse);
			for (let m in months) {
				m = months[m];
				let days = Object.keys(Catalog.dated[y][m]).sort(Sorting.reverse);
				for (let d in days) {
					d = days[d];
					if (!(query && testIncorrectDate([y, m, d], query))) {
						for (let e in Catalog.dated[y][m][d]) {
							let obj = {};
							let raw = Catalog.dated[y][m][d][e];
							obj.shortname = obj.slug = e;
							obj.title = raw.t;
							obj.path = [y, m, d, e].join("-");
							obj.cache = raw['_'];
							obj.date = [y, m, d];
							obj.categories = raw.m.c ? raw.m.c.map(function (i) {
								return Catalog.keys.c[i];
							}).filter(i=>i) : [];
							obj.tags = raw.m.t ? raw.m.t.map(function (i) {
								return Catalog.keys.t[i];
							}).filter(i=>i) : [];
							obj.metas = raw.m;
							if (test(obj)) {
								obj.id = count++;
								list.push(obj);
							}
						}
					}
				}
			}
		}
		return list;
	}
	var searchForUndated = function (test) {
		let list = [];
		let count = 1;
		for (let i in Catalog.undated) {
			let obj = {};
			let raw = Catalog.undated[i];
			obj.title = raw.t;
			obj.shortname = obj.slug = obj.path = i.toString();
			obj.cache = raw['_'];
			obj.categories = raw.m.c ? raw.m.c.map(function (i) {
				return Catalog.keys.c[i];
			}).filter(i=>i) : [];
			obj.tags = raw.m.t ? raw.m.t.map(function (i) {
				return Catalog.keys.t[i];
			}).filter(i=>i) : [];
			obj.metas = raw.m;
			if (test(obj)) {
				obj.id = count++;
				list.push(obj);
			}
		}
		return list;
	}

	var testIncorrectDate = function (date, o) {
		let from = o.after ? Date.parse(o.after.join(" ")) : 0;
		let to = o.before ? Date.parse(o.before.join(" ")) : Date.now();
		let test = Date.parse(date.join(" "));
		let bool = false;
		if (test < from || test > to) {
			bool = true;
		}
		return bool;
	}

	Catalog.queryResult = function (query) {
		let arts = searchFor(function () { return true; }, query);
		
		if (query.cat instanceof QueryArgument) {
			arts.thenCategory(query.cat);
		}
		
		if (query.tag instanceof QueryArgument) {
			arts.thenTags(query.tag);
		}
		if (query.text.trim().length > 0) {
			arts.thenTitle(query.text);
		}
		return arts;
	};

	initFrog();

}).send();

var TemplateTypes = (function(){
	let TemplateType = function TemplateType(value) {
		this.toString = ()=>{
			return value;
		}
	}
	let self = function TemplateTypes(raw){
		raw = raw.toUpperCase();
		if(raw === self.PAGINATION.toString()){
			return self.PAGINATION;
		}
		if(raw === self.ARTICLE.toString()){
			return self.ARTICLE;
		}
		return self.GADGET;
	}
	self.GADGET = new TemplateType('GADGET');
	self.ARTICLE = new TemplateType('ARTICLE');
	self.PAGINATION = new TemplateType('PAGINATION');
	return self;
})();
var TemplateExpressions = (function() {
	var o = {
		regexp:/\{\s*(\?|if|\:|for|include|\+|)\s*([^}]+?)\s*\}/gm
	};

	var operatorsMap = {'<=':'le','>=':'ge','<':'lt','>':'gt','=':'eq','!':'ne','~':'has'};

	var control = function(raw){
		let res = /(.+)\s+(lte|gte|lt|gt|eq|ne|has)\s+(.+)\s*/gm.exec(raw);
		if(!res) res = /(.+)\s*(<=|>=|<|>|=|!|~)\s*(.+)\s*/gm.exec(raw);
		if(res){
			let value = res[1];
			let op = operatorsMap[res[2]] || res[2] ;
			let variable = res[3].trim();
			return 'ft="if" fto="'+op+'" ftp-'+value+'='+'"'+variable+'"';
		}
		return 'ft="if" fto="set" ftp-'+raw;
	}
	var loop = function(raw){
		let res = /\s*(.+)\s+in\s+(.+)\s*/gm.exec(raw);
		if(!res) res = /\s*(.+)\s*=\s*(.+)\s*/gm.exec(raw);
		if(res){
			let variable = res[1].trim();
			let loop = res[2].trim();
			let range = Number.parseInt(loop);
			if(Number.isNaN(range)){
				return 'ft="for" ftf="'+variable+'" ftli="'+loop+'"';
			}else{
				return 'ft="for" ftf="'+variable+'" ftlr="'+range+'"';
			}
		}
		return '';
	}
	var content = function(code){
		code = code.toLowerCase();
		return '<span ft="node" ftn-'+code+'></span>';
	}
	var global = function(code){
		code = code.toLowerCase();
		if(code == 'title'){
			return Catalog.title;
		}else if (Catalog.metas[code]){
			return Catalog.metas[code];
		}
	}
	var attribute = function(attr,val){
		//return 'ft="attr" fta="'+attr+'" ftv="'+val.toLowerCase()+'"';
		return "fta-"+val.toLowerCase()+'="'+attr+'"';
	}
	var include = function(file){
		let data;
		getText(_t(file+'.html'),true).loaded(function(v){
			data = new Template(v).body;
		}).send();
		return data;
	}

	o.replacer = function (_,tag,body) {
		//console.log('TEMPLATE EXPR',"tag: '"+tag+"'","body: '"+body+"'");
		if(tag == '?' || tag == 'if'){
			return control(body);
		} else if(tag == ':' || tag == 'for'){
			return loop(body);
		} else if(tag == 'include' || tag == '+'){
			//console.log('INCLUDE: ',body);
			return include(body);
		} else {
			let res = /(.+)\s*=\s*(.+)\s*/gm.exec(body);
			if(res){
				let attr = res[1].trim();
				let val = res[2].trim();
				//console.log('ATTR: ',attr,val);

				if( val[0] == val[0].toUpperCase() ){
					return attr+'="'+global(val)+'"';
				}

				return attribute(attr,val);

			}else{
				if( body[0] == body[0].toUpperCase() ){
					return global(body);
				}else{
					//console.log('CONT: ',body);
					return content(body);
				}
			}
		}
	};
	o.parse = function parse(str) {
		return str.replace(o.regexp,o.replacer);
	}

	return o;
})();
/* 
		TEMPLATE

		[/] better functions organisation
		[/]	refactor into Object

		[ ] inline expressions ?
		[ ] if & loop performance ?


		

## Namespace

The **first line beginning with a `#`** in a template file can inform about the type and name of it.
```
# TYPE = name
```
The types are (case insensitive) :
- Article:
- Gadget:
- 


*/

var Template = function Template(raw){

	raw = raw.replace(/^#\s*(\w*)+?(?:\s*('|")(\w*?)\2)?\s*/g,(m,temp,_,name)=>{
		this.type = TemplateTypes(temp);
		this.name = name || false;
		return '';
	});

	raw = raw.replace(/^\s*\/\/.*$/gm,'');

	raw = TemplateExpressions.parse(raw);

	this.body = raw;

	this.get = function(){
		let d = document.createElement("div");
		d.innerHTML = raw;
		return d;
	};
}

Template.get = function(file){
	if(!Cache.has(file)){
		var temp;
		getText(file,true).loaded(function(v){
			temp = new Template(v);
			Cache.set(file,v);
		}).send();
		return temp;
	}else{
		temp = new Template(Cache.get(file,temp));
		return temp;
	}
}

/* 
		Article

		[ ] Make a TemplateElement Interface
		[ ] Implement Article, Gadget ...

		[ ] better functions organisation
		[ ]	refactor into Object

		[ ] bulk set values ?

*/

var Article = function(temp){
	let div = temp.get();
	let el = div.firstElementChild;

	let sel = '[ft="if"]';
	let q = div.querySelectorAll(sel);
	for(let i = 0 ; i<q.length; i++){
		q[i].style.display = 'none';
	}

	el.clean = function(){
		let sel = '[ft]';
		let q = el.querySelectorAll(sel);
		for(let i = 0 ; i<q.length; i++){
			let type = q[i].getAttribute('ft');
			if(type=='if'){
				q[i].remove();
			}
		}
	};
	el.set = function(prop,val){

		if(hasValueForAttr(div,prop)){
			setValueForAttr(div,prop,val);
		}
		if(hasValueForCont(el,prop)){
			setValueForCont(el,prop,val);
		}
		if(hasControl(div,prop)){
			setControl(div,prop,val);
		}

		doStaticFor();
		doVariableFor(prop,val);
		
	};
	var hasControl = function(e,v){
		var q = e.querySelector('[ft="if"][ftp-'+v+']');
		return q ? true : false;
	}
	var setControl = function(e,a,v){
		let sel = '[ft="if"][ftp-'+a+']';
		let q = e.querySelectorAll(sel);
		for(let i = 0 ; i<q.length; i++){
			let control = q[i].getAttribute("fto");
			if(control == 'set' || control == ''){
				q[i].removeAttribute("ftp-"+a);
				q[i].removeAttribute("fto");
				q[i].removeAttribute("ft");
				q[i].style.display = '';
			}else{
				let test = q[i].getAttribute("ftp-"+a);
				if(testControl(v,control,test)){
					q[i].style.display = '';
					q[i].removeAttribute("ftp-"+a);
					q[i].removeAttribute("fto");
					q[i].removeAttribute("ft");
				}else{
          q[i].remove();
        }
			}
		}
	}
	var testControl = function(left,op,right){
		//console.log(left,op,right);
		switch (op) {
			case 'eq':
				return left == right;
			case 'ne':
				return left != right;
			case 'lt':
				return left < right;
			case 'gt':
				return left > right;
			case 'le':
				return left <= right;
			case 'ge':
				return left >= right;
			case 'has':
				if(left instanceof Object){
					return left[right] ? true : false;
				}else{
					try {
						left.includes(right);
					} catch (e) {}
				}
			default:
				break;
		}
		return false;
	}
	var hasValueForAttr = function(e,v){
		var q = e.querySelector("[fta-"+v+"]");
		return q ? true : false;
	}
	var setValueForAttr = function(e,a,v){
		let sel = "[fta-"+a+"]";
		let q = e.querySelectorAll(sel);
		for(let i = 0 ; i<q.length; i++){
			let attr = q[i].getAttribute("fta-"+a);
			let ini = q[i].getAttribute(attr) || "";
			q[i].setAttribute(attr,(ini?ini+" ":"")+v);
			q[i].removeAttribute("fta-"+a);
		}
	}
	var hasValueForCont = function(e,v){
		var q = e.querySelector("[ftn-"+v+"]");
		return q ? true : false;
	}
	var setValueForCont = function(e,a,v){
		let q = e.querySelectorAll("[ftn-"+a+"]");
		for(let i = 0 ; i<q.length; i++){
			q[i].replace(v);
		}
	}
	var doStaticFor = function(){
		let q = el.querySelectorAll('[ft="for"][ftlr]');
		for(let i = 0 ; i<q.length; i++){

			let variable = q[i].getAttribute("ftf");
			let range = q[i].getAttribute("ftlr");
			let body = q[i].firstElementChild.cloneNode(true);

			q[i].innerHTML = '';
			
			//console.log(variable,range,body);

			for (let num = 1; num <= range; num++) {
				let clone = body.cloneNode(true);

				if(hasValueForAttr(clone,variable)){setValueForAttr(clone,variable,num);}
				if(hasValueForCont(clone,variable)){setValueForCont(clone,variable,num);}
				if(hasControl(clone,variable)){setControl(clone,variable,num);}

				if(num == 1){
					if(hasValueForAttr(clone,'FIRST')){setValueForAttr(clone,'FIRST',true);}
					if(hasValueForCont(clone,'FIRST')){setValueForCont(clone,'FIRST',true);}
					if(hasControl(clone,'FIRST')){setControl(clone,'FIRST',true);}
				}
				if(num == range){
					if(hasValueForAttr(clone,'LAST')){setValueForAttr(clone,'LAST',true);}
					if(hasValueForCont(clone,'LAST')){setValueForCont(clone,'LAST',true);}
					if(hasControl(clone,'LAST')){setControl(clone,'LAST',true);}
				}

				q[i].appendChild(clone);

			}

			q[i].removeAttribute("ft");
			q[i].removeAttribute("ftf");
			q[i].removeAttribute("ftlr");
		}
	}
	
	var doVariableFor = function(prop,val){
		let q = el.querySelectorAll('[ft="for"][ftli="'+prop+'"]');
		for(let i = 0 ; i<q.length; i++){

			if(!val.length || val.length == 0){
				q[i].remove();
				return;
			}

			let variable = q[i].getAttribute("ftf");
			let body = q[i].firstElementChild.cloneNode(true);

			q[i].innerHTML = '';
			
			let num = 1;

			for (let key of val) {
				let clone = body.cloneNode(true);

				if(hasValueForAttr(clone,variable)){setValueForAttr(clone,variable,key);}
				if(hasValueForCont(clone,variable)){setValueForCont(clone,variable,key);}
				if(hasControl(clone,variable)){setControl(clone,variable,key);}

				if(num == 1){
					if(hasValueForAttr(clone,'FIRST')){setValueForAttr(clone,'FIRST',true);}
					if(hasValueForCont(clone,'FIRST')){setValueForCont(clone,'FIRST',true);}
					if(hasControl(clone,'FIRST')){setControl(clone,'FIRST',true);}
				}
				if(num == val.length){
					if(hasValueForAttr(clone,'LAST')){setValueForAttr(clone,'LAST',true);}
					if(hasValueForCont(clone,'LAST')){setValueForCont(clone,'LAST',true);}
					if(hasControl(clone,'LAST')){setControl(clone,'LAST',true);}
				}
				
				q[i].appendChild(clone);

				num++;

			}

			q[i].removeAttribute("ft");
			q[i].removeAttribute("ftf");
			q[i].removeAttribute("ftli");
		}
	}
	return el;
}

var QueryDate = function QueryDate(arg,values) {

	if(typeof(values) != typeof('') || values.length == 0){return;}			// ERROR
	if(typeof(arg) != typeof('') || arg.length == 0){return;}			// ERROR

	let date = [];

	function readDate(){
		let tmp = values.split(/-| /);
		tmp.forEach(d => {
			// console.log(d[d.length-1]);
			switch(d[d.length-1]){
				case 'Y': case 'y':
					date[0] = d.substring(0,d.length-1);
					break;
				case 'M': case 'm':
					date[1] = d.substring(0,d.length-1);
					break;
				case 'D': case 'd':
					date[2] = d.substring(0,d.length-1);
					break;
				default:
					date.push(d);
					break;
			}
		});
		// console.log(date);
	}

	readDate();

	
	let defineImmutableProperty = immutableProperty.bind(date);
	defineImmutableProperty('argument', arg);

	const str = arg+'('+values+')';
	date.toString = function() {
		return str;
	}

	return date;
}

var QueryArgument = function QueryArgument(arg,values) {

	if(typeof(values) != typeof('') || values.length == 0){return;}		// ERROR
	if(typeof(arg) != typeof('') || arg.length == 0){return;}			// ERROR

	this.include = [], this.exclude = [];
	var str = arg+'('+values+')';

	values.trim().replace(/([^ ,]+)/g,(s,p) => {
		if(p[0]=="-"){
			this.exclude.push(p.substr(1));
		}else{
			this.include.push(p);
		}
	});
	
	let defineImmutableProperty = immutableProperty.bind(this);
	defineImmutableProperty('argument', arg);

	this.toString = function() {
		return str;
	}
}

var Query = function Query(str) {

	if( typeof(str) !== typeof('') || str.length == 0){return;}		// WARNING

	this.reset = () => {
		this.cat = this.tag = this.after = this.before = this.state = [];
		this.text = ""; 
		str = "";
	}

	this.set = (query) => {
		if(!(query instanceof Query)){return;}						// ERROR
		this.cat = query.cat;
		this.tag = query.tag;
		this.text = query.text;
		this.after = query.after;
		this.before = query.before;
		this.state = query.state;
		str = query.toString();
	}

	this.parse = (s) => {
		//if( typeof(s) !== typeof('') || s.length == 0){return;}		// ERROR
		this.reset();
		str = s;
		s = s.replace(/(\w+)\(([^\()]+)\)/g, (a,b,c)=>{
			if(b === 'after' || b === 'before'){
				this[b] = new QueryDate(b,c.replaceParams());
			}else if(b=='state'){
				this[b] = new QueryArgument(b,c.replaceParams());
			}else{
				this[b] = new QueryArgument(b,c.replaceParams());
			}
			return '';
		});
		this.text = s.trim() || ''
	}

	this.toString = () => {
		if(str.length == 0){
			let s = this.text;
			s += ' ' + this.cat.toString();
			s += ' ' + this.tag.toString();
			s += ' ' + this.before.toString();
			s += ' ' + this.after.toString();
			s += ' ' + this.state.toString();
			str = s;
		}
		return str;
	}

	if(str){ 
		this.parse(str); 
	}else{
		this.reset();
	}

}

var PaginationLink = function PaginationLink(flow,page,char) {
	
	page = Math.max(0,Math.min(flow.pages,page));

	let el = document.createElement("span");

	el.innerHTML = char;

	if(page != flow.page){
		el.addEventListener("click",() => {
			flow.goToPage(page);
		});
		el.className = "a";
	}

	return el;

};

var pageLinks = function(el,flow){

	let max = flow.pages;
	let cont = document.createElement("span");
	let top = max > 9 ? 9 : max;
	let p = Math.min(flow.page,max);
	let off = p > 4 ? Math.min(max-8,p-4) : 0;
	for(let i = 0; i<top+1; i++){
		cont.appendChild(createPageLink(el,off+i));
	}
	return cont;

};

var Pagination = function Pagination(flow,template = false) {
	
	let nav = document.createElement("nav");
	nav.className = "frog-pagination";
	nav.goToPage = flow.goToPage;

	nav.appendChild(new PaginationLink(flow,0,"&lt;&lt;"));

	nav.appendChild(new PaginationLink(flow,flow.page-1,"&lt;"));

	for (let id = 0; id <= flow.pages; id++) {
		
		nav.appendChild(new PaginationLink(flow,id,""+(id+1)));

	}

	nav.appendChild(new PaginationLink(flow,flow.page+1,"&gt;"));

	nav.appendChild(new PaginationLink(flow,flow.pages,"&gt;&gt;"));

	return nav;

}


function getAttributes(flow){
   
    let el = flow.element;

    let attrs = {
        flow:OPTIONS.TEMPLATE,
        perpage:OPTIONS.PERPAGE,
        pagination:OPTIONS.PAGINATION,
        state:OPTIONS.STATE
    };

    if(el.hasAttribute('preset')){
        let obj = window[el.getAttribute('preset')] || {};
        Object.assign(attrs,obj);
    }

    let names = el.getAttributeNames();
    names.forEach(key=>{
        if(key.startsWith('on')){
            attrs[key] = window[el.getAttribute(key)];
        }else{
            attrs[key] = el.getAttribute(key);
        }
    })

    return attrs;

}


var initElement = function(el){
    if(el.classList){
        el.classList.add("frog-flow");
    }else{
        el.className += "frog-flow";
    }
}

var cleanElement = function(el){
    ["flow","cat","tag","text",'query','max','page','perpage','hash','scroll','pagination','post','state','loaded']
    .forEach(a=>{el.removeAttribute(a);});
}

var extractQuery = function (obj) {

    let query = obj.query ? obj.query : '';

    if(query === ''){

        query += "".replaceParams.call(obj.text ? obj.text : ' ');

        ['cat','tag'].forEach( key => {
            let value = "".replaceParams.call(obj[key] ? obj[key] : '');
            if( value.length > 0){
                query += ' '+key+'('+value+')';
            }
        });
    }

    ['state'].forEach( key => {
        let value = "".replaceParams.call(obj[key] ? obj[key] : '');
        if( value.length > 0){
            query += ' '+key+'('+value+')';
        }
    });

    return query;
}

var readPagination = function readPagination(el) {
    
    let pagination = {
        position:'bottom',
        target:undefined,
        template:undefined
    };

    let raw = el.getAttribute("frog-pagination") || false;
    if(raw){
        raw.split(' ').forEach((item)=>{
            let f;
            if(item === 'both' || item === 'top'){
                pagination.position = item;
            }else if(f = /<([^>]+)>/.exec(item)){
                pagination.target = document.getElementById(f[1]);
            }else if(f = /\(([^>]+)\)/.exec(item)){
                pagination.template = Template.get(_t(f[1]+'.html'));
            }
        });
    }

    return pagination;
}

function addLoading(flow){

    let el = flow.element;

    let h = el.offsetHeight;

    el.style.minHeight = h+'px';
    el.style.maxHeight = h+'px';
    
    el.style.opacity = '0.7';
    el.style.overflow = 'hidden';

}
function removeLoading(flow){

    let el = flow.element;
    
    // console.log('REMOVE LOADING');

    el.style.minHeight = '0px';
    el.style.maxHeight = 'none';
    el.style.opacity = '1';
    el.style.overflow = 'auto';

}

var Flow = function Flow(root,i='') {

    let self = this;

    initElement(root);

    this.element = root;
    this.id = root.id || 'flow'+FROG.FLOWS;

    let params = getAttributes(this);

    // let defineHookedProperty = hookedProperty.bind(this);
    let defineImmutableProperty = immutableProperty.bind(this);
    let defineRefreshProperty = hookedProperty.bind(this,this.refresh);

    defineRefreshProperty('template',params.flow);
    defineRefreshProperty('max',params.max);
    defineRefreshProperty('perpage',params.perpage);

    let query = extractQuery(params);
    defineImmutableProperty('Query', (new Query(query)) );

    Object.defineProperty(this,'query',{
        set: (v)=>{
            query = v;
            this.Query.parse(v);
            load(this.Query);
            this.refresh();
        },
        get:()=>{
            return query;//this.Query.toString();
        }
    });

    readPagination(root);
    let pagin = params.pagination;
    defineImmutableProperty('pagination',['top','bottom','both','none'].includes(pagin) ? pagin : OPTIONS.PAGINATION);
    defineImmutableProperty('scroll',params.scroll);
    defineImmutableProperty('post',params.post);
    defineImmutableProperty('preload',params.preload);
    defineImmutableProperty('onLoaded',params.loaded);

    let pageBound = function(p){return Math.max(0,Math.min(pageQuantity,p));};

    let pageNb = ( root.getAttribute("page") || (UrlHash.get(this.id) || 0) );
    Object.defineProperty(this,'page',{
        set: (v)=>{ 
            this.goToPage(v); 
        },
        get:()=>{ 
            return pageNb; 
        }
    });
    this.goToPage = (id) => {
        pageNb = pageBound(id);
        UrlHash.set(this.id, pageNb);
        this.refresh();
    }
    this.next = () => {
        this.goToPage(pageBound(pageNb+1));
    }
    this.previous = () => {
        this.goToPage(pageBound(pageNb-1));
    }
    
    let pageQuantity = 0;
    this.last = () => {
        this.goToPage(pageQuantity);
    }
    this.first = () => {
        this.goToPage(0);
    }
    Object.defineProperty(this,'pages',{
        get:()=>{
            return pageQuantity;
        }
    });

    cleanElement(root);

    let template = Template.get(_t(this.template+".html"));
    let result, quantity;

    var load = () => {
        result = Catalog.queryResult(this.Query);
        quantity = result.size;
        pageQuantity = Math.floor((quantity-1)/this.perpage);
    }
    load(this.Query);
    
    var produceArticle = (head) => {
        let art = Article(template,_a(head.path+".json"));
        if(params['folder']) head.path = params['folder']+'/'+head.path;
        if(head.date) art.set("date",head.date.join("-"));
        if(head.title) art.set("title",head.title);
        if(head.categories) art.set("classes",'frog '+(head.categories.join(" ")+' '+head.tags.join(" ")).trim());
        if(head.categories) art.set("categories",head.categories);
        if(head.id) art.set("id",head.id);
        if(head.slug) art.set("slug",head.slug);
        if(head.slug) art.set("slug_id",head.slug+'_'+head.id);
        if(head.path) art.set("path",head.path);
        if(head.slug) art.set("link",'single.html#art='+head.slug);
        if(head.metas){
            let keys = Object.keys(head.metas);
            keys.forEach(meta => {
                if(Number(meta)){
                    let key = Catalog.getMetaKey(meta);
                    art.set(key,head.metas[meta]);
                }
            });
        }
        root.appendChild(art);
        if(this.post) window[this.post](art);

        let cached = Cache.has(head.path) ? Cache.get(head.path) : false;
        if(cached && cached.key == head.cache){
            art.set("content",JSON.parse(cached).data);
            art.clean();
            removeLoading(self);
        }else{
            return getText(_a(head.path+".txt")).loaded(function(raw){
                new Process(new AsyncParse(raw))
                    .pool(Parsing)
                    .done(function(v){ art.set("content",v);art.clean();
                        removeLoading(self);
                        let caching = JSON.stringify({key:head.cache,data:v});
                        Cache.set(head.path,caching);
                    })
                    .start();
            }).send();
        }
    }

    
    let articles = [];
    
    Object.defineProperty(this,'result',{
        get:()=>{
            return result;
        }
    });
    Object.defineProperty(this,'size',{
        get:()=>{
            return result.size;
        }
    });
    this.refresh = () => {
        
        articles = result.get(this.perpage,this.page);

        addLoading(self);
        root.innerHTML = "";

        let pool = new FuturePool();

        articles.forEach((art)=>{
            pool.add(produceArticle(art));
        });
        pool.setTimeout(10000,()=>{
            if(params.timeout) window[params.timeout](this);
        }).done(()=>{
            if(params.loaded) window[params.loaded](this);
        });

        if(result.size > this.perpage && this.pagination != 'none'){
            if(this.pagination == "both" || this.pagination == "top"){
                root.prepend(Pagination(this));
            }
            if(this.pagination == "both" || this.pagination == "bottom"){
                root.appendChild(Pagination(this));
            }
            if(this.page > this.pages || this.page < 0){
                this.goToPage(pageBound(this.page));
            }
        }

       
    };

    this.element.frog = this;

    if(this.preload){
        result.preload();    
    }
    
    this.refresh();

    return this;

}


function Gadget(obj){
    // console.log('GADGETS',obj);
    let el = obj.element;
    let tmp = obj.template;
    let temp = Template.get(_t(tmp+".html")).get().firstElementChild;
    if(temp){
        el.textContent = "";
        el.parentNode.insertBefore(temp, el);
    }
}

function processGadgets(){
    var n, walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()){
        let codes = n.data.match(/\{.+\}/g);
        if(codes){
            codes.forEach(code=>{
                let m;
                if(m = /\s*\{\s*frog(?:-include|\s*\+)\s*(.+)\s*\}/g.exec(code)){
                    // console.log('GADGETS',m);
                    let obj = {template:m[1].trim(),element:n};
                    new Gadget(obj);
                }
            });

        }
        
    }
}

function Insert(obj){
    let el = obj.element;
    let key = obj.key;
    let value = '';
    if(key == 'title'){
        value = Catalog.title;
    }else if(Catalog.metas[key]){
        value = Catalog.metas[key];
    }
    el.textContent = value;
}

function processInserts(){
    var n, a=[], walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()){
        let m;
        if(m = n.data.match(/\s*\{\s*frog\s+(.+)\s*\}/)){
            let obj = {key:m[1].trim(),element:n};
            new Insert(obj);
        }
    }
    walk=document.createTreeWalker(document,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()){
        let m;
        if(m = n.data.match(/\s*\{\s*frog\s+(.+)\s*\}/)){
            let obj = {key:m[1].trim(),element:n};
            new Insert(obj);
        }
    }
}


function doGadgets(){
  processGadgets();
  processInserts();
}

function doFlows() {
  let flows = document.querySelectorAll("[frog]");
  for(let i = 0; i<flows.length; i++){
    let el = flows[i];
    new Flow(el);
  }
}
	
	var initFrog = function() {
		doFlows();
		doGadgets();
	}
	
	window.onload = function(){

		initFrog();
	
		let loader = document.getElementById('FROGLOADER');
		if(loader){
			loader.classList.add('remove');
		}
	
	};
	window.onunload = function(){

		let loader = document.getElementById('FROGLOADER');
		if(loader){
			loader.classList.remove('remove');
		}
	
	};
