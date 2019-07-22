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