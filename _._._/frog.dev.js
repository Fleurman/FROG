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
	
	
	importScript("/_._._/engine/indexer.js");
	importScript(__("util/util.js"));
	importScript(__("ajax/ajax.js"));
	importScript(__("async/async.js"));
	importScript(__("blog/blog.js"));
	importScript(__("view/view.js"));
	
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