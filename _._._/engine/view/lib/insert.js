function Insert(obj){
    let el = obj.element;
    let key = obj.key;
    let value = '';
    if(key == 'title'){
        value = Catalog.title;
    }else if(Catalog.metas[key]){
        value = Catalog.metas[key];
    }
    el.textContent = value;
}

function processInserts(){
    var n, a=[], walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()){
        let m;
        if(m = n.data.match(/\s*\{\s*frog\s+(.+)\s*\}/)){
            let obj = {key:m[1].trim(),element:n};
            new Insert(obj);
        }
    }
    walk=document.createTreeWalker(document,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()){
        let m;
        if(m = n.data.match(/\s*\{\s*frog\s+(.+)\s*\}/)){
            let obj = {key:m[1].trim(),element:n};
            new Insert(obj);
        }
    }
}