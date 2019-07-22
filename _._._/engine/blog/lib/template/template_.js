var tmAttrReplacer = function(m,attr,val){
	return "fta-"+val.toLowerCase()+'="'+attr+'"';
}
var conditionsMap = {'<=':'le','>=':'ge','<':'lt','>':'gt','=':'eq','!':'ne','~':'in'};
var tmIfReplacer = function(m,raw){
	let res = /(.+)\s*(<=|>=|<|>|=|!|~)\s*(.+)\s*/gm.exec(raw);
	if(res){
		let value = res[1];
		let op = conditionsMap[res[2]];
		let variable = res[3].trim();
		return 'ftc="'+op+'" fti-'+value+'='+'"'+variable+'"';
	}
	return 'ftc="set" fti-'+raw;
}
var tmForReplacer = function(m,raw){
	let res = /\s*(.+)\s*=\s*(.+)\s*/gm.exec(raw);
	if(res){
		let variable = res[1].trim();
		let loop = res[2].trim();
		let range = Number.parseInt(loop);
		if(Number.isNaN(range)){
			return 'ftf="'+variable+'" ftli="'+loop+'"';
		}else{
			return 'ftf="'+variable+'" ftlr="'+range+'"';
		}
	}
	return '';
}
var tmContReplacer = function(m,code){
	code = code.toLowerCase();
	return '<span ftc-'+code+'></span>';
}
var tmIncReplacer = function(m,file){
	let data;
	getText(_t(file+'.html'),true).loaded(function(v){
		data = v;
	}).send();
	return data;
}
var TemplateType = function TemplateType(value) {
	//immutableProperty.bind(this)('value', value);
	this.toString = ()=>{
		return value;
	}
}
var TemplateTypes = (function(){
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

var Template = function Template(file,raw){

	raw = raw.replace(/^#\s*(\w*)+?(?:\s*('|")(\w*?)\2)?\s*/g,(m,temp,_,name)=>{
		this.type = TemplateTypes(temp);
		//this.name = name || file.replace(/\..+/,'');
	});

	raw = raw.replace(/\{\s*\include\s+([^}]+)\s*\}/gm,tmIncReplacer);

	raw = raw.replace(/\/\*(.|\n|\r)*\*\//gm,"");
	raw = raw.replace(/\/\/.*$/gm,"");

	raw = raw.replace(/\{\s*\?\s*([^}]+)\s*\}/gm,tmIfReplacer);
	raw = raw.replace(/\{\s*\:\s*([^}]+)\s*\}/gm,tmForReplacer);
	raw = raw.replace(/\{\s*(.+)\s*=\s*([^}]+)\s*\}/gm,tmAttrReplacer);
	raw = raw.replace(/\{\s*([^}]+)\s*\}/gm,tmContReplacer);
	
	this.body = raw;

	this.get = function(){
		let d = document.createElement("div");
		d.innerHTML = raw;
		return d;
	};
}
Template.get = function(file){
	if(!Catalog.templates[file]){
		var temp;
		getText(file,true).loaded(function(v){
			temp = new Template(file,v);
		}).send();
		Catalog.templates[file] = temp;
	}
	return Catalog.templates[file];
}
