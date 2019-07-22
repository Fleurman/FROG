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