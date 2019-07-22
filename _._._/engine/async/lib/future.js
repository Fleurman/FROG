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