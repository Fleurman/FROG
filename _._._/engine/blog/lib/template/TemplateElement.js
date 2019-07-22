var TemplateElement = function(temp){
	let div = temp.get();
	let el = div.firstElementChild;

	let sel = '[ft="if"]';
	let q = div.querySelectorAll(sel);
	for(let i = 0 ; i<q.length; i++){
		q[i].style.display = 'none';
	}

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
		var q = e.querySelector('[ft][ftp-'+v+']');
		return q ? true : false;
	}
	var setControl = function(e,a,v){
		let sel = '[ft][ftp-'+a+']';
		let q = e.querySelectorAll(sel);
		for(let i = 0 ; i<q.length; i++){
			let operator = q[i].getAttribute("fto");
			if(operator == 'set' || operator == ''){
				q[i].removeAttribute("fti-"+a);
				q[i].removeAttribute("ft");
				q[i].style.display = '';
			}else{
				let test = q[i].getAttribute("fti-"+a);
				if(testControl(v,operator,test)){
					q[i].style.display = '';
					q[i].removeAttribute("fti-"+a);
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
			case 'in':
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
			let ini = q[i].getAttribute(attr) + ' ' || ' ';
			q[i].setAttribute(attr,ini+v);
			q[i].removeAttribute("fta-"+a);
		}
	}
	var hasValueForCont = function(e,v){
		var q = e.querySelector("[ftc-"+v+"]");
		return q ? true : false;
	}
	var setValueForCont = function(e,a,v){
		let q = e.querySelectorAll("[ftc-"+a+"]");
		for(let i = 0 ; i<q.length; i++){
			q[i].innerHTML = v;
			q[i].removeAttribute("ftc-"+a);
		}
	}
	var doStaticFor = function(){
		let q = el.querySelectorAll("[ftf][ftlr]");
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

			q[i].removeAttribute("ftf");
			q[i].removeAttribute("ftlr");
		}
	}
	
	var doVariableFor = function(prop,val){
		let q = el.querySelectorAll('[ftf][ftli="'+prop+'"]');
		for(let i = 0 ; i<q.length; i++){

			let variable = q[i].getAttribute("ftf");
			let body = q[i].firstElementChild.cloneNode(true);

			q[i].innerHTML = '';
			
			let num = 0;

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

			q[i].removeAttribute("ftf");
			q[i].removeAttribute("ftli");
		}
	}
	return el;
}