var UrlHash = (()=>{
    var o = {};
    var table = {};
    o.read = () => {
        window.location.hash
            .replace("#","")
            .split("&")
            .forEach(function(e){
                let v = e.split("=");
                if(v[0] && v[1]){
                    let value = decodeURIComponent(v[1]);
                    try {
                        value = JSON.parse(decodeURIComponent(v[1]));
                    } catch (e) {}
                    table[v[0]] = value;
                }
    })};
    o.write = () => {
        let hash = '#';
        let pairs = [];
        Object.keys(table).forEach(key => {
            let value = table[key];
            if(typeof(value) === typeof({})){ value = JSON.stringify(value); }
            pairs.push(key + '=' + encodeURIComponent(value));
        });
        hash += pairs.join('&');
        window.location.hash = hash;
    };
    o.get = (key) => {
        o.read();
        return table[key];
    };
    o.set = (key,value) => {

        if(typeof(key) === typeof({})){
            table = Object.assign(table,key);
        }else{
            table[key] = value;
        }

        o.write();
    };
    Object.defineProperty(o,'list',{
        get:() => {
            let copy = {};
            Object.keys(table).forEach(key => {
                copy[key] = table[key];
            });
            return copy;
        }
    })
    window.addEventListener('load',o.read());
    return o;
})();