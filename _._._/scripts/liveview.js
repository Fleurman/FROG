LiveView = (function(){
	function Editor(lang) {
		var box = document.createElement("div");
		box.className = "lv-panel-left";
		if(lang){box.setAttribute("lang",lang);}
		var text = document.createElement("textarea");
		text.className = "lv-editor";
		text.setAttribute("spellcheck","false");
		text.style= "resize:none;";
		box.appendChild(text);
		box.inner = text;
		Object.defineProperty(box, 'value', {
		  get() { return text.value; },
		  set(v) { text.value = v; },
		  configurable: true
		});
		return box;
	}
	function View(lang) {
		var box = document.createElement("div");
		if(lang){box.setAttribute("lang",lang);}
		box.className = "lv-panel-right meno";
		var inner = document.createElement("div");
		inner.className = "lv-view";
		box.appendChild(inner);
		Object.defineProperty(box, 'value', {
		  get() { return inner.innerHTML; },
		  set(v) { inner.innerHTML = v; },
		  configurable: true
		});
		return box;
	}
	function HeightHandle(el){
		var handle = document.createElement("div");
		handle.className = "lv-height";
		handle.innerHTML = "- - -";
		handle.addEventListener('mousedown', initDrag, false);
		var startY, startHeight;
		function initDrag(e) {
			startY = e.clientY;
			e.preventDefault();
			startHeight = parseInt(document.defaultView.getComputedStyle(el).height, 10);
			document.documentElement.addEventListener('mousemove', doDrag, false);
			document.documentElement.addEventListener('mouseup', stopDrag, false);
		}
		function doDrag(e) {
			var nw = startHeight + e.clientY - startY;
			el.style.height = nw + 'px';
		}
		function stopDrag(e) {
			document.documentElement.removeEventListener('mousemove', doDrag, false);    
			document.documentElement.removeEventListener('mouseup', stopDrag, false);
		}
		return handle;
	}
	function Reset(edit){
		var box = document.createElement("div");
		box.className = "lv-reset";
		box.title = "reset";
		box.onclick = edit.init;
		return box;
	}
	function LiveView(params) {
		params.start = params.start.replace(/<br>/g,'');
		var box = document.createElement("div");
		box.className = "liveview";
		box.edit = Editor(params.langs[0]);
		box.view = View(params.langs[1]);
		box.refresh = function(){ box.view.value = params.parser(box.edit.value); };
		box.edit.onkeyup = box.refresh;
		box.appendChild(box.edit);
		box.appendChild(box.view);
		box.appendChild(HeightHandle(box));
		if(params.init){
			box.edit.init = function(){ box.edit.value = params.start;box.refresh(); };
			box.init = box.edit.init;
			box.edit.appendChild(Reset(box))
		}
		if(params.start && params.start != ""){
			box.edit.value = params.start;
		}
		box.refresh();
		return box;
	}

	function convert(id,parser) {
		
		var lvs = document.querySelectorAll('script[type="text/liveview:'+id+'"]');
		
		for (var i = 0; i < lvs.length; i++) {
			
			var params = {parser: parser};
			var raw = lvs[i].innerHTML.replace(/^\s*/gm,"").replace(/<br>/g,'');
			params.start = raw;
			params.langs = [lvs[i].getAttribute("left"),lvs[i].getAttribute("right")];
			if(lvs[i].getAttribute("init"))params.init = true;
			
			var lv = LiveView(params);
			
			var attrs = lvs[i].attributes;
			for(var a=0;a<attrs.length;a++){
				var attr = attrs[a];
				if(attr.name == "class")lv.className += " " + attr.value;
				if(attr.name == "id")lv.id += attr.value;
				if(attr.name == "height")lv.style.height = attr.value;
				if(attr.name == "min-height")lv.style.minHeight = attr.value;
			}
			lvs[i].parentNode.insertBefore(lv, lvs[i]);
			lvs[i].parentNode.removeChild(lvs[i]);
			lv.edit.inner.value = raw;
			lv.refresh();
		}
	}
	return {
		create : LiveView,
		convert : convert
	}
})();