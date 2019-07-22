var Catalog = {
	date: (function () {
		let d = new Date();
		return Date.parse([d.getFullYear(), d.getMonth(), d.getDate()].join(" "));
	})(),
	getMetaKey: function(key){
		return Catalog.keys[key];
	},
	templates: {}
};

var sentenceContains = function (str, arr) {
	str = str.toLowerCase();
	for (let i = 0; i < arr.length; i++) {
		let w = arr[i].toLowerCase();
		if (str.includes(w)) { return true; }
	}
	return false;
}

var arrayContains = function(a1,a2){
	a1.sort();a2.sort();
	for(let i = 0; i<a1.length; i++){
		for(let j = 0; j<a2.length; j++){
			if(a1[i] && a2[j]){
				if(a1[i]==a2[j]){
					// console.log('CONTAINS TRUE',a1,a2);
					return true;
				}
			}
		}
	}
	// console.log('CONTAINS FALSE',a1,a2);
	return false;
}

var testInclude = function (t1, t2) {
	return arrayContains(t1, t2);
}
var testExclude = function (t1, t2) {
	return !arrayContains(t1, t2);
}

getJson(_a("_catalog.json"), true).loaded(function (data) {
	
	Catalog.title = data.t;
	Catalog.metas = data.m;
	Catalog.keys = data.k;
	Catalog.dated = data.d;
	Catalog.undated = data.u;

	var searchFor = function (test, query) {
		let arts = new CatalogResult();

		let type = (query.state.include && query.state.include.includes('undated')) ? 'undated' : 'dated';

		if (type == 'undated') {
			arts.merge(searchForUndated(test,query));
		}else {
			arts.merge(searchForDated(test,query));
		}

		return arts;
	}
	
	var searchForDated = function (test,query) {
		let years = Object.keys(Catalog.dated).sort(Sorting.reverse);
		let list = [];
		let count = 1;
		for (let y in years) {
			y = years[y];
			let months = Object.keys(Catalog.dated[y]).sort(Sorting.reverse);
			for (let m in months) {
				m = months[m];
				let days = Object.keys(Catalog.dated[y][m]).sort(Sorting.reverse);
				for (let d in days) {
					d = days[d];
					if (!(query && testIncorrectDate([y, m, d], query))) {
						for (let e in Catalog.dated[y][m][d]) {
							let obj = {};
							let raw = Catalog.dated[y][m][d][e];
							obj.shortname = obj.slug = e;
							obj.title = raw.t;
							obj.path = [y, m, d, e].join("-");
							obj.cache = raw['_'];
							obj.date = [y, m, d];
							obj.categories = raw.m.c ? raw.m.c.map(function (i) {
								return Catalog.keys.c[i];
							}).filter(i=>i) : [];
							obj.tags = raw.m.t ? raw.m.t.map(function (i) {
								return Catalog.keys.t[i];
							}).filter(i=>i) : [];
							obj.metas = raw.m;
							if (test(obj)) {
								obj.id = count++;
								list.push(obj);
							}
						}
					}
				}
			}
		}
		return list;
	}
	var searchForUndated = function (test) {
		let list = [];
		let count = 1;
		for (let i in Catalog.undated) {
			let obj = {};
			let raw = Catalog.undated[i];
			obj.title = raw.t;
			obj.shortname = obj.slug = obj.path = i.toString();
			obj.cache = raw['_'];
			obj.categories = raw.m.c ? raw.m.c.map(function (i) {
				return Catalog.keys.c[i];
			}).filter(i=>i) : [];
			obj.tags = raw.m.t ? raw.m.t.map(function (i) {
				return Catalog.keys.t[i];
			}).filter(i=>i) : [];
			obj.metas = raw.m;
			if (test(obj)) {
				obj.id = count++;
				list.push(obj);
			}
		}
		return list;
	}

	var testIncorrectDate = function (date, o) {
		let from = o.after ? Date.parse(o.after.join(" ")) : 0;
		let to = o.before ? Date.parse(o.before.join(" ")) : Date.now();
		let test = Date.parse(date.join(" "));
		let bool = false;
		if (test < from || test > to) {
			bool = true;
		}
		return bool;
	}

	Catalog.queryResult = function (query) {
		let arts = searchFor(function () { return true; }, query);
		
		if (query.cat instanceof QueryArgument) {
			arts.thenCategory(query.cat);
		}
		
		if (query.tag instanceof QueryArgument) {
			arts.thenTags(query.tag);
		}
		if (query.text.trim().length > 0) {
			arts.thenTitle(query.text);
		}
		return arts;
	};

	initFrog();

}).send();