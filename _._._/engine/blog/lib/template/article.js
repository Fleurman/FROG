/* 
		Article

		[ ] Make a TemplateElement Interface
		[ ] Implement Article, Gadget ...

		[ ] better functions organisation
		[ ]	refactor into Object

		[ ] bulk set values ?

*/

var Article = function(temp){
	let div = temp.get();
	let el = div.firstElementChild;

	let sel = '[ft="if"]';
	let q = div.querySelectorAll(sel);
	for(let i = 0 ; i<q.length; i++){
		q[i].style.display = 'none';
	}

	el.clean = function(){
		let sel = '[ft]';
		let q = el.querySelectorAll(sel);
		for(let i = 0 ; i<q.length; i++){
			let type = q[i].getAttribute('ft');
			if(type=='if'){
				q[i].remove();
			}
		}
	};
	el.set = function(prop,val){

		if(hasValueForAttr(div,prop)){
			setValueForAttr(div,prop,val);
		}
		if(hasValueForCont(el,prop)){
			setValueForCont(el,prop,val);
		}
		if(hasControl(div,prop)){
			setControl(div,prop,val);
		}

		doStaticFor();
		doVariableFor(prop,val);
		
	};
	var hasControl = function(e,v){
		var q = e.querySelector('[ft="if"][ftp-'+v+']');
		return q ? true : false;
	}
	var setControl = function(e,a,v){
		let sel = '[ft="if"][ftp-'+a+']';
		let q = e.querySelectorAll(sel);
		for(let i = 0 ; i<q.length; i++){
			let control = q[i].getAttribute("fto");
			if(control == 'set' || control == ''){
				q[i].removeAttribute("ftp-"+a);
				q[i].removeAttribute("fto");
				q[i].removeAttribute("ft");
				q[i].style.display = '';
			}else{
				let test = q[i].getAttribute("ftp-"+a);
				if(testControl(v,control,test)){
					q[i].style.display = '';
					q[i].removeAttribute("ftp-"+a);
					q[i].removeAttribute("fto");
					q[i].removeAttribute("ft");
				}else{
          q[i].remove();
        }
			}
		}
	}
	var testControl = function(left,op,right){
		//console.log(left,op,right);
		switch (op) {
			case 'eq':
				return left == right;
			case 'ne':
				return left != right;
			case 'lt':
				return left < right;
			case 'gt':
				return left > right;
			case 'le':
				return left <= right;
			case 'ge':
				return left >= right;
			case 'has':
				if(left instanceof Object){
					return left[right] ? true : false;
				}else{
					try {
						left.includes(right);
					} catch (e) {}
				}
			default:
				break;
		}
		return false;
	}
	var hasValueForAttr = function(e,v){
		var q = e.querySelector("[fta-"+v+"]");
		return q ? true : false;
	}
	var setValueForAttr = function(e,a,v){
		let sel = "[fta-"+a+"]";
		let q = e.querySelectorAll(sel);
		for(let i = 0 ; i<q.length; i++){
			let attr = q[i].getAttribute("fta-"+a);
			let ini = q[i].getAttribute(attr) || "";
			q[i].setAttribute(attr,(ini?ini+" ":"")+v);
			q[i].removeAttribute("fta-"+a);
		}
	}
	var hasValueForCont = function(e,v){
		var q = e.querySelector("[ftn-"+v+"]");
		return q ? true : false;
	}
	var setValueForCont = function(e,a,v){
		let q = e.querySelectorAll("[ftn-"+a+"]");
		for(let i = 0 ; i<q.length; i++){
			q[i].replace(v);
		}
	}
	var doStaticFor = function(){
		let q = el.querySelectorAll('[ft="for"][ftlr]');
		for(let i = 0 ; i<q.length; i++){

			let variable = q[i].getAttribute("ftf");
			let range = q[i].getAttribute("ftlr");
			let body = q[i].firstElementChild.cloneNode(true);

			q[i].innerHTML = '';
			
			//console.log(variable,range,body);

			for (let num = 1; num <= range; num++) {
				let clone = body.cloneNode(true);

				if(hasValueForAttr(clone,variable)){setValueForAttr(clone,variable,num);}
				if(hasValueForCont(clone,variable)){setValueForCont(clone,variable,num);}
				if(hasControl(clone,variable)){setControl(clone,variable,num);}

				if(num == 1){
					if(hasValueForAttr(clone,'FIRST')){setValueForAttr(clone,'FIRST',true);}
					if(hasValueForCont(clone,'FIRST')){setValueForCont(clone,'FIRST',true);}
					if(hasControl(clone,'FIRST')){setControl(clone,'FIRST',true);}
				}
				if(num == range){
					if(hasValueForAttr(clone,'LAST')){setValueForAttr(clone,'LAST',true);}
					if(hasValueForCont(clone,'LAST')){setValueForCont(clone,'LAST',true);}
					if(hasControl(clone,'LAST')){setControl(clone,'LAST',true);}
				}

				q[i].appendChild(clone);

			}

			q[i].removeAttribute("ft");
			q[i].removeAttribute("ftf");
			q[i].removeAttribute("ftlr");
		}
	}
	
	var doVariableFor = function(prop,val){
		let q = el.querySelectorAll('[ft="for"][ftli="'+prop+'"]');
		for(let i = 0 ; i<q.length; i++){

			if(!val.length || val.length == 0){
				q[i].remove();
				return;
			}

			let variable = q[i].getAttribute("ftf");
			let body = q[i].firstElementChild.cloneNode(true);

			q[i].innerHTML = '';
			
			let num = 1;

			for (let key of val) {
				let clone = body.cloneNode(true);

				if(hasValueForAttr(clone,variable)){setValueForAttr(clone,variable,key);}
				if(hasValueForCont(clone,variable)){setValueForCont(clone,variable,key);}
				if(hasControl(clone,variable)){setControl(clone,variable,key);}

				if(num == 1){
					if(hasValueForAttr(clone,'FIRST')){setValueForAttr(clone,'FIRST',true);}
					if(hasValueForCont(clone,'FIRST')){setValueForCont(clone,'FIRST',true);}
					if(hasControl(clone,'FIRST')){setControl(clone,'FIRST',true);}
				}
				if(num == val.length){
					if(hasValueForAttr(clone,'LAST')){setValueForAttr(clone,'LAST',true);}
					if(hasValueForCont(clone,'LAST')){setValueForCont(clone,'LAST',true);}
					if(hasControl(clone,'LAST')){setControl(clone,'LAST',true);}
				}
				
				q[i].appendChild(clone);

				num++;

			}

			q[i].removeAttribute("ft");
			q[i].removeAttribute("ftf");
			q[i].removeAttribute("ftli");
		}
	}
	return el;
}