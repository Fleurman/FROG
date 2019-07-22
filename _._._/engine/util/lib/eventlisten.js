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