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