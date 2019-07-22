
function Gadget(obj){
    // console.log('GADGETS',obj);
    let el = obj.element;
    let tmp = obj.template;
    let temp = Template.get(_t(tmp+".html")).get().firstElementChild;
    if(temp){
        el.textContent = "";
        el.parentNode.insertBefore(temp, el);
    }
}

function processGadgets(){
    var n, walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()){
        let codes = n.data.match(/\{.+\}/g);
        if(codes){
            codes.forEach(code=>{
                let m;
                if(m = /\s*\{\s*frog(?:-include|\s*\+)\s*(.+)\s*\}/g.exec(code)){
                    // console.log('GADGETS',m);
                    let obj = {template:m[1].trim(),element:n};
                    new Gadget(obj);
                }
            });

        }
        
    }
}