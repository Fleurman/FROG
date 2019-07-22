var TemplateTypes = (function(){
	let TemplateType = function TemplateType(value) {
		this.toString = ()=>{
			return value;
		}
	}
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