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