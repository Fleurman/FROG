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