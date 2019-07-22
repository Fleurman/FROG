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
