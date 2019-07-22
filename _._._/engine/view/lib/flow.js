
function getAttributes(flow){
   
    let el = flow.element;

    let attrs = {
        flow:OPTIONS.TEMPLATE,
        perpage:OPTIONS.PERPAGE,
        pagination:OPTIONS.PAGINATION,
        state:OPTIONS.STATE
    };

    if(el.hasAttribute('preset')){
        let obj = window[el.getAttribute('preset')] || {};
        Object.assign(attrs,obj);
    }

    let names = el.getAttributeNames();
    names.forEach(key=>{
        if(key.startsWith('on')){
            attrs[key] = window[el.getAttribute(key)];
        }else{
            attrs[key] = el.getAttribute(key);
        }
    })

    return attrs;

}


var initElement = function(el){
    if(el.classList){
        el.classList.add("frog-flow");
    }else{
        el.className += "frog-flow";
    }
}

var cleanElement = function(el){
    ["flow","cat","tag","text",'query','max','page','perpage','hash','scroll','pagination','post','state','loaded']
    .forEach(a=>{el.removeAttribute(a);});
}

var extractQuery = function (obj) {

    let query = obj.query ? obj.query : '';

    if(query === ''){

        query += "".replaceParams.call(obj.text ? obj.text : ' ');

        ['cat','tag'].forEach( key => {
            let value = "".replaceParams.call(obj[key] ? obj[key] : '');
            if( value.length > 0){
                query += ' '+key+'('+value+')';
            }
        });
    }

    ['state'].forEach( key => {
        let value = "".replaceParams.call(obj[key] ? obj[key] : '');
        if( value.length > 0){
            query += ' '+key+'('+value+')';
        }
    });

    return query;
}

var readPagination = function readPagination(el) {
    
    let pagination = {
        position:'bottom',
        target:undefined,
        template:undefined
    };

    let raw = el.getAttribute("frog-pagination") || false;
    if(raw){
        raw.split(' ').forEach((item)=>{
            let f;
            if(item === 'both' || item === 'top'){
                pagination.position = item;
            }else if(f = /<([^>]+)>/.exec(item)){
                pagination.target = document.getElementById(f[1]);
            }else if(f = /\(([^>]+)\)/.exec(item)){
                pagination.template = Template.get(_t(f[1]+'.html'));
            }
        });
    }

    return pagination;
}

function addLoading(flow){

    let el = flow.element;

    let h = el.offsetHeight;

    el.style.minHeight = h+'px';
    el.style.maxHeight = h+'px';
    
    el.style.opacity = '0.7';
    el.style.overflow = 'hidden';

}
function removeLoading(flow){

    let el = flow.element;
    
    // console.log('REMOVE LOADING');

    el.style.minHeight = '0px';
    el.style.maxHeight = 'none';
    el.style.opacity = '1';
    el.style.overflow = 'auto';

}

var Flow = function Flow(root,i='') {

    let self = this;

    initElement(root);

    this.element = root;
    this.id = root.id || 'flow'+FROG.FLOWS;

    let params = getAttributes(this);

    // let defineHookedProperty = hookedProperty.bind(this);
    let defineImmutableProperty = immutableProperty.bind(this);
    let defineRefreshProperty = hookedProperty.bind(this,this.refresh);

    defineRefreshProperty('template',params.flow);
    defineRefreshProperty('max',params.max);
    defineRefreshProperty('perpage',params.perpage);

    let query = extractQuery(params);
    defineImmutableProperty('Query', (new Query(query)) );

    Object.defineProperty(this,'query',{
        set: (v)=>{
            query = v;
            this.Query.parse(v);
            load(this.Query);
            this.refresh();
        },
        get:()=>{
            return query;//this.Query.toString();
        }
    });

    readPagination(root);
    let pagin = params.pagination;
    defineImmutableProperty('pagination',['top','bottom','both','none'].includes(pagin) ? pagin : OPTIONS.PAGINATION);
    defineImmutableProperty('scroll',params.scroll);
    defineImmutableProperty('post',params.post);
    defineImmutableProperty('preload',params.preload);
    defineImmutableProperty('onLoaded',params.loaded);

    let pageBound = function(p){return Math.max(0,Math.min(pageQuantity,p));};

    let pageNb = ( root.getAttribute("page") || (UrlHash.get(this.id) || 0) );
    Object.defineProperty(this,'page',{
        set: (v)=>{ 
            this.goToPage(v); 
        },
        get:()=>{ 
            return pageNb; 
        }
    });
    this.goToPage = (id) => {
        pageNb = pageBound(id);
        UrlHash.set(this.id, pageNb);
        this.refresh();
    }
    this.next = () => {
        this.goToPage(pageBound(pageNb+1));
    }
    this.previous = () => {
        this.goToPage(pageBound(pageNb-1));
    }
    
    let pageQuantity = 0;
    this.last = () => {
        this.goToPage(pageQuantity);
    }
    this.first = () => {
        this.goToPage(0);
    }
    Object.defineProperty(this,'pages',{
        get:()=>{
            return pageQuantity;
        }
    });

    cleanElement(root);

    let template = Template.get(_t(this.template+".html"));
    let result, quantity;

    var load = () => {
        result = Catalog.queryResult(this.Query);
        quantity = result.size;
        pageQuantity = Math.floor((quantity-1)/this.perpage);
    }
    load(this.Query);
    
    var produceArticle = (head) => {
        let art = Article(template,_a(head.path+".json"));
        if(params['folder']) head.path = params['folder']+'/'+head.path;
        if(head.date) art.set("date",head.date.join("-"));
        if(head.title) art.set("title",head.title);
        if(head.categories) art.set("classes",'frog '+(head.categories.join(" ")+' '+head.tags.join(" ")).trim());
        if(head.categories) art.set("categories",head.categories);
        if(head.id) art.set("id",head.id);
        if(head.slug) art.set("slug",head.slug);
        if(head.slug) art.set("slug_id",head.slug+'_'+head.id);
        if(head.path) art.set("path",head.path);
        if(head.slug) art.set("link",'single.html#art='+head.slug);
        if(head.metas){
            let keys = Object.keys(head.metas);
            keys.forEach(meta => {
                if(Number(meta)){
                    let key = Catalog.getMetaKey(meta);
                    art.set(key,head.metas[meta]);
                }
            });
        }
        root.appendChild(art);
        if(this.post) window[this.post](art);

        let cached = Cache.has(head.path) ? Cache.get(head.path) : false;
        if(cached && cached.key == head.cache){
            art.set("content",JSON.parse(cached).data);
            art.clean();
            removeLoading(self);
        }else{
            return getText(_a(head.path+".txt")).loaded(function(raw){
                new Process(new AsyncParse(raw))
                    .pool(Parsing)
                    .done(function(v){ art.set("content",v);art.clean();
                        removeLoading(self);
                        let caching = JSON.stringify({key:head.cache,data:v});
                        Cache.set(head.path,caching);
                    })
                    .start();
            }).send();
        }
    }

    
    let articles = [];
    
    Object.defineProperty(this,'result',{
        get:()=>{
            return result;
        }
    });
    Object.defineProperty(this,'size',{
        get:()=>{
            return result.size;
        }
    });
    this.refresh = () => {
        
        articles = result.get(this.perpage,this.page);

        addLoading(self);
        root.innerHTML = "";

        let pool = new FuturePool();

        articles.forEach((art)=>{
            pool.add(produceArticle(art));
        });
        pool.setTimeout(10000,()=>{
            if(params.timeout) window[params.timeout](this);
        }).done(()=>{
            if(params.loaded) window[params.loaded](this);
        });

        if(result.size > this.perpage && this.pagination != 'none'){
            if(this.pagination == "both" || this.pagination == "top"){
                root.prepend(Pagination(this));
            }
            if(this.pagination == "both" || this.pagination == "bottom"){
                root.appendChild(Pagination(this));
            }
            if(this.page > this.pages || this.page < 0){
                this.goToPage(pageBound(this.page));
            }
        }

       
    };

    this.element.frog = this;

    if(this.preload){
        result.preload();    
    }
    
    this.refresh();

    return this;

}